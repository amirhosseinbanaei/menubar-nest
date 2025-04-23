import { PartialType } from '@nestjs/mapped-types';
import { CreateRestaurantDto } from './create-restaurant.dto';
import { CreateWorkingHourDto } from './create-working-hours.dto';
import { IsArray, IsNumber, IsOptional, ValidateNested } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { DetailTranslationDto } from 'src/languages/dto/translation.dto';
import { CreateSocialDto } from './create-social.dto';

export class UpdateRestaurantDto extends PartialType(CreateRestaurantDto) {
  // @IsOptional()
  // @IsNumber()
  // : number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Transform(({ value }) =>
    typeof value === 'string' ? JSON.parse(value) : value,
  )
  colorPaletteId: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DetailTranslationDto)
  @Transform(({ value }) =>
    typeof value === 'string' ? JSON.parse(value) : value,
  )
  translations: DetailTranslationDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateWorkingHourDto)
  @Transform(({ value }) =>
    typeof value === 'string' ? JSON.parse(value) : value,
  )
  workingHours: CreateWorkingHourDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSocialDto)
  @Transform(({ value }) =>
    typeof value === 'string' ? JSON.parse(value) : value,
  )
  socials: CreateSocialDto[];
}
