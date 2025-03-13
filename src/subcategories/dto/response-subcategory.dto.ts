import { Expose, Type } from 'class-transformer';
import { TranslationDto } from '../../languages/dto/translation.dto';

export class SubCategoryResponseDto {
  @Expose()
  id: number;

  @Expose()
  order: number;

  @Expose()
  @Type(() => TranslationDto)
  translations: TranslationDto[];

  @Expose()
  created_at: Date;
}

export class SubCategoryInCategoryDto {
  @Expose()
  id: number;

  @Expose()
  order: number;

  @Expose()
  @Type(() => TranslationDto)
  translations: TranslationDto[];

  constructor(partial: Partial<SubCategoryInCategoryDto>) {
    Object.assign(this, partial);
  }
}
