import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { MenusService } from './menus.service';
import { Public } from 'src/auth/decorators/public.decorator';

@Public()
@Controller('menu')
export class MenusController {
  constructor(private readonly menusService: MenusService) {}

  @Get()
  getFullMenu(
    @Query('lang') language: string,
    @Query('restaurant_id', ParseIntPipe) restaurant_id: number,
  ) {
    return this.menusService.test(restaurant_id, language);
  }

  @Get(':category_id')
  findOne(@Param('category_id', ParseIntPipe) category_id: number) {
    return this.menusService.findOne(category_id);
  }
}
