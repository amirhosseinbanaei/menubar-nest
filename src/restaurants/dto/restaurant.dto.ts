import { PartialType } from '@nestjs/mapped-types';
import { IsEmpty, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateRestaurantDto {
  @IsNotEmpty()
  @Length(1, 225)
  name: string;
  @IsEmpty()
  @IsString()
  logo_url?: string;
  @IsNotEmpty()
  subscription_plan: 'basic' | 'enterprise' | 'premium';
}
export class UpdateRestaurantDto extends PartialType(CreateRestaurantDto) {}
