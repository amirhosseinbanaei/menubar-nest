import { Expose, Type } from 'class-transformer';
import { TranslationDto } from '../../languages/dto/translation.dto';
import { ItemResponseDto } from 'src/items/dto/response-item.dto';

class SubCategories {
  @Expose()
  id: number;

  @Expose()
  order: number;

  @Expose()
  @Type(() => TranslationDto)
  translations: TranslationDto[];

  @Expose()
  @Type(() => ItemResponseDto)
  items: ItemResponseDto[];
}

export class MenuResponseDto {
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
  @Type(() => SubCategories)
  subcategories: SubCategories[];

  constructor(partial: Partial<MenuResponseDto>) {
    Object.assign(this, partial);
  }
}
