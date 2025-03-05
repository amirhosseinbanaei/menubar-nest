import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { RequestOtpDto } from './dto/request-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { User } from 'src/users/entities/user.entity';
import { LoginAdminDto } from './dto/login-admin.dto';
import { AdminsService } from 'src/admins/admins.service';
import { plainToInstance } from 'class-transformer';
import { AdminResponseDto } from 'src/admins/dto/response-admin.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly adminService: AdminsService,
  ) {}

  private generateOtp(): string {
    // Generate 4-digit OTP
    return Math.floor(1000 + Math.random() * 9000).toString();
  }

  async requestOtp(requestOtpDto: RequestOtpDto) {
    const { phone_number } = requestOtpDto;

    // Find or create user
    let user = await this.usersService.findByPhone(phone_number);
    if (!user) {
      user = (await this.usersService.create({ phone_number })) as User;
    }

    // Generate new OTP
    const otp = this.generateOtp();
    const otpExpiry = new Date(Date.now() + 3 * 60000); // 3 minutes expiry

    // Save OTP to user
    await this.usersService.updateOtp(user.id, {
      otp,
      otp_expiry: otpExpiry,
    });

    // TODO: Integrate with SMS service to send OTP
    // await this.smsService.sendOtp(phone_number, otp);

    return {
      message: 'OTP sent successfully',
      // Return OTP in development environment only
      ...(process.env.NODE_ENV === 'development' && { otp }),
    };
  }

  async verifyOtp(verifyOtpDto: VerifyOtpDto) {
    const { phone_number, otp } = verifyOtpDto;

    const user = await this.usersService.findByPhone(phone_number);
    if (!user) {
      throw new UnauthorizedException('Invalid phone number');
    }

    if (!user.otp || !user.otp_expiry) {
      throw new BadRequestException('No OTP requested');
    }

    if (new Date() > user.otp_expiry) {
      throw new BadRequestException('OTP expired');
    }

    if (user.otp !== otp) {
      throw new UnauthorizedException('Invalid OTP');
    }

    // Clear OTP after successful verification
    await this.usersService.updateOtp(user.id, {
      otp: null,
      otp_expiry: null,
      is_verified: true,
    });

    // Generate JWT token
    const payload = { sub: user.id, phone: user.phone_number };
    return {
      access_token: await this.jwtService.signAsync(payload),
      user: {
        id: user.id,
        phone_number: user.phone_number,
        full_name: user.full_name,
        is_verified: true,
      },
    };
  }

  async validateAdmin(email: string, password: string) {
    try {
      const admin = await this.adminService.findByEmail(email);
      const isValid = await admin.validatePassword(password);

      if (!isValid) {
        throw new UnauthorizedException('Invalid credentials');
      }

      return plainToInstance(AdminResponseDto, admin, {
        excludeExtraneousValues: true,
      });
    } catch {
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  async loginAdmin(loginAdminDto: LoginAdminDto) {
    const admin = await this.validateAdmin(
      loginAdminDto.email,
      loginAdminDto.password,
    );

    const payload = { sub: admin.id, email: admin.email };

    return {
      access_token: await this.jwtService.signAsync(payload),
      admin,
    };
  }
}
