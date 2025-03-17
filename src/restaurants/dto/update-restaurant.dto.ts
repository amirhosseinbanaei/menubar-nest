import { PartialType } from '@nestjs/mapped-types';
import { CreateRestaurantDto } from './create-restaurant.dto';
import { CreateWorkingHourDto } from './create-working-hours.dto';
import { IsArray, ValidateNested } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { DetailTranslationDto } from 'src/languages/dto/translation.dto';

export class UpdateRestaurantDto extends PartialType(CreateRestaurantDto) {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DetailTranslationDto)
  @Transform(({ value }) =>
    typeof value === 'string' ? JSON.parse(value) : value,
  )
  translations: DetailTranslationDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateWorkingHourDto)
  @Transform(({ value }) =>
    typeof value === 'string' ? JSON.parse(value) : value,
  )
  workingHours: CreateWorkingHourDto[];
}
