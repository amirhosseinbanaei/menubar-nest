import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { LanguagesService } from './languages.service';
import { CreateLanguageDto } from './dto/create-language.dto';

@Controller('languages')
export class LanguagesController {
  constructor(private readonly languagesService: LanguagesService) {}
  @Post()
  create(@Body() languageDto: CreateLanguageDto) {
    return this.languagesService.create(languageDto);
  }

  @Get()
  findAll() {
    return this.languagesService.findAll();
  }

  @Get(':language_code')
  findOne(@Param('language_code') language_code: string) {
    return this.languagesService.findOne(language_code);
  }
}
