import {
  Controller,
  Post,
  Body,
  Delete,
  Param,
  ParseIntPipe,
  Get,
  Query,
  Patch,
  Put,
} from '@nestjs/common';
import { LanguageValidationPipe } from '../common/pipes/language.pipe';
import { SubcategoriesService } from './subcategories.service';
import { CreateSubcategoryDto } from './dto/create-subcategory.dto';
import {
  UpdateSubcategoryDto,
  UpdateSubcategoryOrdersDto,
} from './dto/update-subcategory.dto';

@Controller('subcategories')
export class SubcategoriesController {
  constructor(private readonly subcategoriesService: SubcategoriesService) {}

  @Post()
  create(
    @Body(new LanguageValidationPipe())
    createSubcategoryDto: CreateSubcategoryDto,
  ) {
    return this.subcategoriesService.create(createSubcategoryDto);
  }

  @Get()
  findAll(
    @Query('category_id') categoryId: string | undefined,
    @Query('lang') language: string | undefined,
  ) {
    return this.subcategoriesService.findAll(categoryId, language, {
      serialize: true,
    });
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Query('lang') language: string,
  ) {
    return this.subcategoriesService.findOne(id, language, {
      serialize: true,
    });
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSubcategoryDto: UpdateSubcategoryDto,
  ) {
    return this.subcategoriesService.update(id, updateSubcategoryDto);
  }

  @Put()
  updateOrders(@Body() updateSubcategoryOrdersDto: UpdateSubcategoryOrdersDto) {
    return this.subcategoriesService.updateOrders(updateSubcategoryOrdersDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.subcategoriesService.remove(id);
  }
}
