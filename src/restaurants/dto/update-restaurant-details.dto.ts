import { PartialType } from '@nestjs/mapped-types';
import { CreateRestaurantDetailsDto } from './create-restaurant-details.dto';

export class UpdateRestaurantDetailsDto extends PartialType(
  CreateRestaurantDetailsDto,
) {}
