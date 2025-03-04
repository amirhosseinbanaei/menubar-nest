import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTranslationDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty()
  language: string;
}
