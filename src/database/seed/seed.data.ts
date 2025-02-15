import { CreateLanguageDto } from 'src/languages/dto/language.dto';

const languages: CreateLanguageDto[] = [
  { language_code: 'en', language_name: 'English' },
  { language_code: 'ar', language_name: 'Arabic' },
  { language_code: 'fa', language_name: 'Persian' },
  { language_code: 'fr', language_name: 'French' },
];

export { languages };
