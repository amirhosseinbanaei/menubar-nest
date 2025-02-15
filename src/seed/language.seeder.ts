import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Language } from '../languages/entities/language.entity';

@Injectable()
export class LanguageSeeder {
  constructor(
    @InjectRepository(Language)
    private readonly languageRepository: Repository<Language>,
  ) {}

  create() {
    const languages = [
      {
        language_name: 'English',
        language_code: 'en',
      },
      {
        language_name: 'Persian',
        language_code: 'fa',
      },
    ];

    return languages.map(async (language) => {
      const isExistLanguage = await this.languageRepository.findOne({
        where: { language_code: language.language_code },
      });
      if (!isExistLanguage) {
        return await this.languageRepository.save(language);
      }
      Promise.resolve(null);
    });
  }
}
