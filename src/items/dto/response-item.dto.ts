import { Expose, Transform, Type } from 'class-transformer';
import { DetailTranslationDto } from '../../languages/dto/translation.dto';
import { SubCategoryResponseDto } from '../../subcategories/dto/response-subcategory.dto';
import { CategoryResponseDto } from 'src/categories/dto/response-category.dto';
import { TagResponseDto } from 'src/tags/dto/response-tag.dto';

export class ItemResponseDto {
  @Expose()
  id: number;

  @Expose({ name: 'category_id' })
  @Type(() => CategoryResponseDto)
  @Transform(({ obj }) => obj.category?.id ?? null, {
    toClassOnly: true,
  })
  category_id: number | null;

  @Expose({ name: 'subcategory_id' })
  @Type(() => SubCategoryResponseDto)
  @Transform(({ obj }) => obj.subcategory?.id ?? null, {
    toClassOnly: true,
  })
  subcategory_id: number | null;

  @Expose()
  image: string;

  @Expose()
  order: number;

  @Expose()
  price: number;

  @Expose()
  discount: number;

  @Expose()
  is_hide: number;

  @Expose()
  is_available: number;

  @Expose()
  @Type(() => DetailTranslationDto)
  translations: DetailTranslationDto[];

  @Expose()
  @Type(() => TagResponseDto)
  tags: TagResponseDto[];

  @Expose()
  created_at: Date;

  constructor(partial: Partial<ItemResponseDto>) {
    Object.assign(this, partial);
  }
}
