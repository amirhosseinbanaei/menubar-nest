import { Transform } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';
import { RestaurantOptionsFilter } from '../enum/restaurant-options-filter.enum';

export class FilterRestaurantDto {
  @IsOptional()
  @Transform(({ value }) => value?.split(','))
  @IsEnum(RestaurantOptionsFilter, { each: true })
  filter?: RestaurantOptionsFilter[];
}
