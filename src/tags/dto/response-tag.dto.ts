import { Expose, Type } from 'class-transformer';
import { DetailTranslationDto } from '../../languages/dto/translation.dto';

export class TagResponseDto {
  @Expose()
  id: number;

  @Expose()
  image: string;

  @Expose()
  @Type(() => DetailTranslationDto)
  translations: DetailTranslationDto[];

  constructor(partial: Partial<TagResponseDto>) {
    Object.assign(this, partial);
  }
}
