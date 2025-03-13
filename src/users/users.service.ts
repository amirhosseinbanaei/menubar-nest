import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { plainToInstance } from 'class-transformer';
import { UserResponseDto } from './dto/response-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = this.usersRepository.create(createUserDto);
    await this.usersRepository.save(user);

    return plainToInstance(UserResponseDto, user, {
      excludeExtraneousValues: true,
    });
  }

  findAll() {
    return `This action returns all users`;
  }

  async findOne(phone_number: string) {
    const user = await this.usersRepository.findOne({
      where: { phone_number },
    });

    return plainToInstance(UserResponseDto, user, {
      excludeExtraneousValues: true,
    });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    console.log(updateUserDto);
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async findByPhone(phone_number: string) {
    return this.usersRepository.findOne({ where: { phone_number } });
  }

  async updateOtp(
    id: number,
    data: {
      otp?: string | null;
      otp_expiry?: Date | null;
      is_verified?: boolean;
    },
  ) {
    return this.usersRepository.update(id, data);
  }
}
