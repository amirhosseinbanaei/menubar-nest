import { Expose } from 'class-transformer';

export class LanguageDto {
  @Expose()
  language_name: string;
  @Expose()
  language_code: string;
}
