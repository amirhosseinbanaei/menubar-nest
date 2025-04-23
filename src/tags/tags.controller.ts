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
import { TagsService } from './tags.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { CustomFileInterceptor } from 'src/common/interceptors/file.interceptor';
import { LanguageValidationPipe } from 'src/common/pipes/language.pipe';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Post()
  @UseInterceptors(CustomFileInterceptor('image', './uploads/tags', 'image'))
  create(
    @UploadedFile() file: Express.Multer.File | undefined,
    @Body(new LanguageValidationPipe()) createTagDto: CreateTagDto,
  ) {
    return this.tagsService.create(createTagDto, file?.filename);
  }

  @Get()
  findAll(@Query('lang') language: string | undefined) {
    return this.tagsService.findAll(language, {
      serialize: true,
      relation: true,
    });
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Query('lang') language: string | undefined,
  ) {
    return this.tagsService.findOne(id, language, {
      serialize: true,
      relation: true,
    });
  }

  @Patch(':id')
  @UseInterceptors(CustomFileInterceptor('image', './uploads/tags', 'image'))
  update(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
    @Body() updateTagDto: UpdateTagDto,
  ) {
    return this.tagsService.update(id, updateTagDto, file);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.tagsService.remove(id);
  }
}
