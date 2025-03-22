import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { MenusService } from './menus.service';

@Controller('menu')
export class MenusController {
  constructor(private readonly menusService: MenusService) {}

  @Get()
  findAll() {
    return this.menusService.findAll();
  }

  @Get(':category_id')
  findOne(@Param('category_id', ParseIntPipe) category_id: number) {
    return this.menusService.findOne(category_id);
  }
}
