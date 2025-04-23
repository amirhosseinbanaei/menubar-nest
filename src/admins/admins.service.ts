import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from './entities/admin.entity';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { plainToInstance } from 'class-transformer';
import { AdminResponseDto } from './dto/response-admin.dto';
import { Role } from './enum/admin-role.enum';

@Injectable()
export class AdminsService {
  constructor(
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
  ) {}

  async create(createAdminDto: CreateAdminDto) {
    if (createAdminDto.role === Role.Admin && !createAdminDto.national_number) {
      throw new BadRequestException(
        'National number is required for admin role',
      );
    }
    // Check for existing admin with same email
    const existingAdmin = await this.adminRepository.findOne({
      where: [
        { national_number: createAdminDto.national_number },
        { phone_number: createAdminDto.phone_number },
      ],
    });

    if (existingAdmin) {
      throw new ConflictException(
        'Admin with this national number or phone number already exists',
      );
    }

    const admin = this.adminRepository.create(createAdminDto);
    await this.adminRepository.save(admin);

    return plainToInstance(AdminResponseDto, admin, {
      excludeExtraneousValues: true,
    });
  }

  async findByEmail(email: string) {
    const admin = await this.adminRepository.findOne({
      where: { email },
    });

    if (!admin) {
      throw new NotFoundException('Admin not found');
    }

    return admin;
  }

  async findAll() {
    const admins = await this.adminRepository.find();

    return plainToInstance(AdminResponseDto, admins, {
      excludeExtraneousValues: true,
    });
  }

  async findOne(id: number) {
    const admin = await this.adminRepository.findOne({
      where: {
        id,
      },
    });

    return plainToInstance(AdminResponseDto, admin, {
      excludeExtraneousValues: true,
    });
  }

  async update(id: number, updateAdminDto: UpdateAdminDto) {
    const admin = await this.adminRepository.findOne({
      where: { id },
    });

    if (!admin) {
      throw new NotFoundException('Admin not found');
    }

    Object.assign(admin, updateAdminDto);
    await this.adminRepository.save(admin);

    return plainToInstance(AdminResponseDto, admin, {
      excludeExtraneousValues: true,
    });
  }
}
