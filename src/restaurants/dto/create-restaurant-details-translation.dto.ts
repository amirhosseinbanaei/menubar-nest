import { IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateRestaurantDetailsTranslationDto {
  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsOptional()
  title: string;

  @IsNumber()
  language_id: number;
}
