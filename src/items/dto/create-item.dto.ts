import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { CreateTranslationDto } from '../../languages/dto/create-translation.dto';

export class CreateItemDto {
  @IsNumber()
  @Type(() => Number)
  restaurant_id: number;

  @IsNumber()
  @Type(() => Number)
  branch_id: number;

  @IsNumber()
  @Type(() => Number)
  category_id: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  subcategory_id?: number;

  @IsNumber()
  @Type(() => Number)
  price: number;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  discount?: number;

  @Transform(({ value }) => JSON.parse(value))
  @IsBoolean()
  is_hidden: boolean;

  @Transform(({ value }) => JSON.parse(value))
  @IsBoolean()
  is_available: boolean;

  @IsOptional()
  image?: string;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  // @Type(() => Number)
  @Transform(({ value }) =>
    typeof value === 'string' ? JSON.parse(value) : value,
  )
  tag_ids?: number[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateTranslationDto)
  @Transform(({ value }) =>
    typeof value === 'string' ? JSON.parse(value) : value,
  )
  translations: CreateTranslationDto[];
}
