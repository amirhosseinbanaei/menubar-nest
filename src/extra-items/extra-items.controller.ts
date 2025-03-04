import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ExtraItemsService } from './extra-items.service';
import { CreateExtraItemDto } from './dto/create-extra-item.dto';
import { UpdateExtraItemDto } from './dto/update-extra-item.dto';

@Controller('extra-items')
export class ExtraItemsController {
  constructor(private readonly extraItemsService: ExtraItemsService) {}

  @Post()
  create(@Body() createExtraItemDto: CreateExtraItemDto) {
    return this.extraItemsService.create(createExtraItemDto);
  }

  @Get()
  findAll() {
    return this.extraItemsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.extraItemsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateExtraItemDto: UpdateExtraItemDto) {
    return this.extraItemsService.update(+id, updateExtraItemDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.extraItemsService.remove(+id);
  }
}
