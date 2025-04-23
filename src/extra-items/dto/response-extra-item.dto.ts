import { Expose, Type } from 'class-transformer';
import { TranslationDto } from 'src/languages/dto/translation.dto';

export class ExtraItemResponseDto {
  @Expose()
  id: number;

  @Expose()
  price: number;

  @Expose()
  is_hidden: boolean;

  @Expose()
  image: string;

  @Expose()
  @Type(() => TranslationDto)
  translations: TranslationDto[];
}
