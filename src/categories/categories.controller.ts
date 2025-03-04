import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  UploadedFile,
  ParseIntPipe,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { LanguageValidationPipe } from '../common/pipes/language.pipe';
import { CustomFileInterceptor } from '../common/interceptors/file.interceptor';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @UseInterceptors(
    CustomFileInterceptor('image', './uploads/categories', 'image'),
  )
  create(
    @UploadedFile() file: Express.Multer.File,
    @Body(new LanguageValidationPipe()) createCategoryDto: CreateCategoryDto,
  ) {
    return this.categoriesService.create(createCategoryDto, file.filename);
  }

  @Get()
  findAll(@Query('lang') language: string | undefined) {
    return this.categoriesService.findAll(language, {
      relation: true,
      serialize: true,
    });
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Query('lang') language: string | undefined,
  ) {
    return this.categoriesService.findOne(id, language, {
      relation: true,
      serialize: true,
    });
  }

  @Patch(':id')
  @UseInterceptors(
    CustomFileInterceptor('image', './uploads/categories', 'image'),
  )
  update(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(id, updateCategoryDto, file);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.remove(id);
  }
}
