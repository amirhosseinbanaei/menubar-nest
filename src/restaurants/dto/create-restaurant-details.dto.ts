import {
  IsString,
  IsOptional,
  IsObject,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class ColorPaletteDto {
  @IsString()
  @IsOptional()
  primary: string;

  @IsString()
  @IsOptional()
  secondary: string;

  @IsString()
  @IsOptional()
  accent: string;

  @IsString()
  @IsOptional()
  background: string;

  @IsString()
  @IsOptional()
  text: string;
}

export class CreateRestaurantDetailsDto {
  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsOptional()
  title: string;

  @IsString()
  @IsOptional()
  logo: string;

  @IsObject()
  @ValidateNested()
  @Type(() => ColorPaletteDto)
  @IsOptional()
  color_palette: ColorPaletteDto;
}
