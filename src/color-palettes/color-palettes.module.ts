import { Module } from '@nestjs/common';
import { ColorPalettesService } from './color-palettes.service';
import { ColorPalettesController } from './color-palettes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ColorPalettes } from './entities/color-palette.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ColorPalettes])],
  controllers: [ColorPalettesController],
  providers: [ColorPalettesService],
})
export class ColorPalettesModule {}
