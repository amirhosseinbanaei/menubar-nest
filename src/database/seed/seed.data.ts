import { CreateLanguageDto } from '../../languages/dto/create-language.dto';

const languages: CreateLanguageDto[] = [
  { language_code: 'en', language_name: 'English' },
  { language_code: 'ar', language_name: 'Arabic' },
  { language_code: 'fa', language_name: 'Persian' },
  { language_code: 'fr', language_name: 'French' },
];

const categories = [
  {
    id: 41,
    restaurant: { id: 1 },
    image: 'https://google.com/image.png',
    order: 1,
    branch_id: 0,
  },
  {
    id: 42,
    restaurant: { id: 1 },
    image: 'https://facebook.com/image.png',
    order: 2,
    branch_id: 0,
  },
];

const categoryTranslations = [
  {
    name: 'سوشی',
    language: { language_code: 'fa' },
    category: { id: 41 },
  },
  {
    name: 'sushi',
    language: { language_code: 'en' },
    category: { id: 41 },
  },
  {
    name: 'پیتزا',
    language: { language_code: 'fa' },
    category: { id: 42 },
  },
  {
    name: 'pizza',
    language: { language_code: 'en' },
    category: { id: 42 },
  },
];

export { languages, categories, categoryTranslations };
