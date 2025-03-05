import { IsEmail, IsString, Length } from 'class-validator';
import { Transform } from 'class-transformer';

export class LoginAdminDto {
  @IsEmail()
  @Transform(({ value }) => value?.toLowerCase().trim())
  email: string;

  @IsString()
  @Length(8, 30)
  password: string;
}