import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsNumber, Length } from 'class-validator';

export class CreateRestaurantLanguageDto {
  @IsNotEmpty()
  @Length(2, 10)
  language_code: string;
  @IsNotEmpty()
  @IsNumber()
  restaurant_id: number;
}
export class UpdateRestaurantLanguageDto extends PartialType(
  CreateRestaurantLanguageDto,
) {}
