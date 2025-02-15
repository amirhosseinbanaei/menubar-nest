import { IsString, Length } from 'class-validator';

export class CreateLanguageDto {
  @IsString()
  language_name: string;
  @Length(2, 5)
  language_code: string;
}
