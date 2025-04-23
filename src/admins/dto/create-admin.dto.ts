import {
  IsString,
  IsEmail,
  Length,
  Matches,
  IsEnum,
  ValidateIf,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { Role } from 'src/admins/enum/admin-role.enum';

export class CreateAdminDto {
  @IsString()
  @Length(2, 100)
  @Transform(({ value }) => value?.trim())
  @Matches(/^[a-zA-Z\s]*$/, {
    message: 'Full name can only contain letters and spaces',
  })
  full_name: string;

  @IsEmail()
  @Transform(({ value }) => value?.toLowerCase().trim())
  email: string;

  @IsString()
  @Length(8, 30)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character',
  })
  password: string;

  @ValidateIf((o) => o.role === Role.Admin)
  @IsString()
  @Length(10, 10)
  @Matches(/^\d+$/, {
    message: 'National number must contain only numbers',
  })
  national_number?: string;

  @IsString()
  @Transform(({ value }) => {
    return value?.replace(/\s+/g, '').replace(/[-()+]/g, '');
  })
  phone_number: string;

  @IsEnum(Role)
  role: Role;
}
