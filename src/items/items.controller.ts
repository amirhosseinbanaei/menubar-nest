import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
  Get,
  Query,
  Param,
  ParseIntPipe,
  Delete,
  Patch,
} from '@nestjs/common';
import { ItemsService } from './items.service';
import { CreateItemDto } from './dto/create-item.dto';
import { CustomFileInterceptor } from 'src/common/interceptors/file.interceptor';
import { LanguageValidationPipe } from 'src/common/pipes/language.pipe';
import { UpdateItemDto } from './dto/update-item.dto';

@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Post()
  @UseInterceptors(CustomFileInterceptor('image', './uploads/items', 'image'))
  create(
    @UploadedFile() file: Express.Multer.File,
    @Body(new LanguageValidationPipe()) createItemDto: CreateItemDto,
  ) {
    return this.itemsService.create(createItemDto, file.filename);
  }

  @Get()
  findAll(@Query('lang') language: string | undefined) {
    return this.itemsService.findAll(language, {
      serialize: true,
      relation: true,
    });
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Query('lang') language: string | undefined,
  ) {
    return this.itemsService.findOne(id, language, {
      serialize: true,
      relation: true,
    });
  }

  @Patch(':id')
  @UseInterceptors(CustomFileInterceptor('image', './uploads/items', 'image'))
  update(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
    @Body() updateCategoryDto: UpdateItemDto,
  ) {
    return this.itemsService.update(id, updateCategoryDto, file);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.itemsService.remove(id);
  }
}
