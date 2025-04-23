import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { ColorPalettesService } from './color-palettes.service';
import { CreateColorPaletteDto } from './dto/create-color-palette.dto';
import { UpdateColorPaletteDto } from './dto/update-color-palette.dto';

@Controller('color-palettes')
export class ColorPalettesController {
  constructor(private readonly colorPalettesService: ColorPalettesService) {}

  @Post()
  create(@Body() createColorPaletteDto: CreateColorPaletteDto) {
    return this.colorPalettesService.create(createColorPaletteDto);
  }

  @Get(':restaurant_id')
  async findAll(@Param('restaurant_id', ParseIntPipe) restaurant_id: number) {
    const defaultPalettes =
      await this.colorPalettesService.findDefaultPalettes();
    const restaurantPalettes =
      await this.colorPalettesService.findRestaurantPalettes(restaurant_id);

    return {
      default_palettes: defaultPalettes,
      custom_palettes: restaurantPalettes,
    };
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateColorPaletteDto: UpdateColorPaletteDto,
  ) {
    return this.colorPalettesService.update(+id, updateColorPaletteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.colorPalettesService.remove(+id);
  }
}
