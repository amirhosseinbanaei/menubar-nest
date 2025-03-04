import { Expose, Transform, Type } from 'class-transformer';
import { LanguageDto } from './language.dto';

export class TranslationDto {
  @Expose()
  name: string;

  @Expose()
  @Type(() => LanguageDto)
  @Transform(({ obj }) => obj.language?.language_code ?? null, {
    toPlainOnly: true,
  })
  language: string;
}

export class DetailTranslationDto extends TranslationDto {
  @Expose()
  description: string;
}
