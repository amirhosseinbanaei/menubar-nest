import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { CustomFileInterceptor } from 'src/common/interceptors/file.interceptor';
import { LanguageValidationPipe } from 'src/common/pipes/language.pipe';
import { ExtraItemsService } from './extra-items.service';
import { CreateExtraItemDto } from './dto/create-extra-item.dto';
import { UpdateExtraItemDto } from './dto/update-extra-item.dto';

@Controller('extra-items')
export class ExtraItemsController {
  constructor(private readonly extraItemsService: ExtraItemsService) {}

  @Post()
  @UseInterceptors(
    CustomFileInterceptor('image', './uploads/extra-items', 'image'),
  )
  create(
    @UploadedFile() file: Express.Multer.File,
    @Body(new LanguageValidationPipe()) createExtraItemDto: CreateExtraItemDto,
  ) {
    return this.extraItemsService.create(createExtraItemDto, file.filename);
  }

  @Get()
  findAll(@Query('lang') language: string | undefined) {
    return this.extraItemsService.findAll(language, {
      serialize: true,
      relation: true,
    });
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Query('lang') language: string | undefined,
  ) {
    return this.extraItemsService.findOne(id, language, {
      serialize: true,
      relation: true,
    });
  }

  @Patch(':id')
  @UseInterceptors(
    CustomFileInterceptor('image', './uploads/extra-items', 'image'),
  )
  update(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
    @Body() updateExtraItemDto: UpdateExtraItemDto,
  ) {
    return this.extraItemsService.update(id, updateExtraItemDto, file);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.extraItemsService.remove(id);
  }
}
