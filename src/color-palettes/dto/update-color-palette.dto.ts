import { PartialType } from '@nestjs/mapped-types';
import { CreateColorPaletteDto } from './create-color-palette.dto';

export class UpdateColorPaletteDto extends PartialType(CreateColorPaletteDto) {}
