import { ConflictException, Injectable } from '@nestjs/common';
import { CreateLanguageDto } from './dto/language.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Language } from './entities/language.entity';

@Injectable()
export class LanguagesService {
  constructor(
    @InjectRepository(Language) private languageService: Repository<Language>,
  ) {}

  async create(languageDto: CreateLanguageDto) {
    const { language_code, language_name } = languageDto;

    const isExistLanguage = await this.languageService.findOne({
      where: { language_code, language_name },
    });

    if (!isExistLanguage) await this.languageService.save(languageDto);
    throw new ConflictException('Language is already exist !');
  }

  async findAll() {
    return await this.languageService.find();
  }

  async findOne(language_code: string) {
    return await this.languageService.findOne({
      where: { language_code },
    });
  }
}
