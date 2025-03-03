import { Expose, Type } from 'class-transformer';
import { TranslationDto } from '../../languages/dto/translation.dto';
import { SubCategoryInCategoryDto } from 'src/subcategories/dto/response-subcategory.dto';

export class CategoryResponseDto {
  @Expose()
  id: number;

  @Expose()
  image: string;

  @Expose()
  order: number;

  @Expose()
  @Type(() => TranslationDto)
  translations: TranslationDto[];

  @Expose()
  @Type(() => SubCategoryInCategoryDto)
  subcategories: SubCategoryInCategoryDto[];

  @Expose()
  created_at: Date;

  constructor(partial: Partial<CategoryResponseDto>) {
    Object.assign(this, partial);
  }
}
