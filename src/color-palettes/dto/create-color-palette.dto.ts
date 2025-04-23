import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateColorPaletteDto {
  @IsString()
  name: string;

  @IsString()
  background: string;

  @IsString()
  foreground: string;

  @IsString()
  primary: string;

  @IsString()
  primary_foreground: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  restaurant_id?: number;
}
