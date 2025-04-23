import { IsEmail, IsString, Length } from 'class-validator';
import { Transform } from 'class-transformer';

export class AdminLoginDto {
  @IsEmail()
  @Transform(({ value }) => value?.toLowerCase().trim())
  email: string;

  @IsString()
  @Length(8, 30)
  password: string;
}
