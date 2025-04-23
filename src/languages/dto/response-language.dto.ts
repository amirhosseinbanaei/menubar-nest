import { Expose } from 'class-transformer';

export class ResponseLanguageDto {
  @Expose()
  language_name: string;
  @Expose()
  language_code: string;
}
