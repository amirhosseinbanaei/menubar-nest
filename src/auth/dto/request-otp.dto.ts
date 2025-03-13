import { IsPhoneNumber } from 'class-validator';
import { Transform } from 'class-transformer';

export class RequestOtpDto {
  @IsPhoneNumber('IR')
  @Transform(({ value }) => value?.replace(/\s+/g, '').replace(/[-()+]/g, ''))
  phone_number: string;
}
