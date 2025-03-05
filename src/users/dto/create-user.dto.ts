import {
  IsString,
  IsPhoneNumber,
  Length,
  Matches,
  IsOptional,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateUserDto {
  @IsOptional()
  @IsString()
  @Length(2, 100)
  @Transform(({ value }) => value?.trim())
  @Matches(/^[a-zA-Z\s]*$/, {
    message: 'Full name can only contain letters and spaces',
  })
  full_name?: string;

  @IsPhoneNumber()
  @Transform(({ value }) => {
    // Remove any spaces or special characters from phone number
    return value?.replace(/\s+/g, '').replace(/[-()+]/g, '');
  })
  phone_number: string;
}
