import { PartialType } from '@nestjs/mapped-types';
import { CreateRestaurantDetailsTranslationDto } from './create-restaurant-details-translation.dto';

export class UpdateRestaurantDetailsTranslationDto extends PartialType(
  CreateRestaurantDetailsTranslationDto,
) {}
