import { IsNotEmpty } from "class-validator";

import { IsEmail } from "class-validator";

export class RegisterAdminDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  full_name: string;

  @IsNotEmpty()
  phone: string;

  @IsNotEmpty()
  role: string;

  @IsNotEmpty()
  status: string;

  @IsNotEmpty()
  image: string;
  
  
}
