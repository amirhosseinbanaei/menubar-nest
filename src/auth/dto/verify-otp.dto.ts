import { IsString, Length, IsPhoneNumber } from 'class-validator';
import { Transform } from 'class-transformer';

export class VerifyOtpDto {
  @IsPhoneNumber()
  @Transform(({ value }) => value?.replace(/\s+/g, '').replace(/[-()+]/g, ''))
  phone_number: string;

  @IsString()
  @Length(6, 6)
  otp: string;
} 