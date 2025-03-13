import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class LanguageValidationPipe implements PipeTransform {
  transform(value: any) {
    const allowedLanguages = ['en', 'fa', 'ar', 'fr'];
    let translations = value.translations;

    if (typeof translations === 'string') {
      try {
        translations = JSON.parse(translations);
      } catch (error) {
        throw new BadRequestException({
          status: 'error',
          message: 'Invalid JSON string',
          error,
        });
      }
    }

    if (
      !Array.isArray(translations) ||
      translations.length < allowedLanguages.length
    ) {
      throw new BadRequestException(
        `All languages are required. Languages: ${allowedLanguages.join(', ')}`,
      );
    }

    const disAllowedLanguages: string[] = [];
    for (const item of translations) {
      if (!allowedLanguages.includes(item.language)) {
        disAllowedLanguages.push(item.language);
      }
    }

    if (disAllowedLanguages.length) {
      throw new BadRequestException(
        `${disAllowedLanguages.join(', ')} language not exist.`,
      );
    }

    // Update value and pass on
    value.translations = translations;
    return value;
  }
}
