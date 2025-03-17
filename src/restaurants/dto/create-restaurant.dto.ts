import { Transform, Type } from 'class-transformer';
import { DetailTranslationDto } from '../../languages/dto/translation.dto';
import { IsArray, ValidateNested } from 'class-validator';

export class CreateRestaurantDto {
  logo?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DetailTranslationDto)
  @Transform(({ value }) =>
    typeof value === 'string' ? JSON.parse(value) : value,
  )
  translations: DetailTranslationDto[];

  constructor(partial: Partial<CreateRestaurantDto>) {
    Object.assign(this, partial);
  }
}
