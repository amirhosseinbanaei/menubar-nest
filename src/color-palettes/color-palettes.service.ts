import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateColorPaletteDto } from './dto/create-color-palette.dto';
import { UpdateColorPaletteDto } from './dto/update-color-palette.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ColorPalettes } from './entities/color-palette.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ColorPalettesService {
  constructor(
    @InjectRepository(ColorPalettes)
    private readonly colorPaletteRepository: Repository<ColorPalettes>,
  ) {}

  async create(createColorPaletteDto: CreateColorPaletteDto) {
    const { restaurant_id } = createColorPaletteDto;
    const colorPalette = await this.colorPaletteRepository.save({
      ...createColorPaletteDto,
      restaurant: restaurant_id ? { id: restaurant_id } : null,
    });
    return colorPalette;
  }

  async findOne(id: number) {
    const colorPalette = await this.colorPaletteRepository.findOne({
      where: {
        id,
      },
    });

    if (!colorPalette)
      throw new NotFoundException(`Color Pallete with ID ${id} not found.`);

    return colorPalette;
  }

  async findDefaultPalettes() {
    const defaultPalettes = await this.colorPaletteRepository
      .createQueryBuilder('palette')
      .where('palette.restaurant.id IS NULL')
      .getMany();
    return defaultPalettes;
  }

  async findRestaurantPalettes(restaurant_id: number) {
    const colorPalettes = await this.colorPaletteRepository.find({
      where: {
        restaurant: { id: restaurant_id },
      },
    });
    return colorPalettes;
  }

  async update(id: number, updateColorPaletteDto: UpdateColorPaletteDto) {
    const colorPalette = await this.findOne(id);
    if (!colorPalette) return;
    await this.colorPaletteRepository.update(id, updateColorPaletteDto);
    return { ...colorPalette, ...updateColorPaletteDto };
  }

  async remove(id: number) {
    const colorPalette = await this.findOne(id);
    if (!colorPalette) return;
    await this.colorPaletteRepository.delete(id);
    return 'Color Palette Deleted Successfully.';
  }
}
