import { IsString, Length, IsPhoneNumber } from 'class-validator';
import { Transform } from 'class-transformer';

export class VerifyOtpDto {
  @IsPhoneNumber('IR')
  @Transform(({ value }) => value?.replace(/\s+/g, '').replace(/[-()+]/g, ''))
  phone_number: string;

  @IsString()
  @Length(4, 4)
  otp: string;
}
