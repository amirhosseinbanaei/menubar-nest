import { Length } from 'class-validator';

export class CreateLanguageDto {
  language_name: string;
  @Length(2, 10)
  language_code: string;
}
