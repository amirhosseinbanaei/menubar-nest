import { PartialType } from '@nestjs/mapped-types';
import { CreateSubcategoryDto } from './create-subcategory.dto';
import {
  IsArray,
  IsEmpty,
  IsNotEmpty,
  IsNumber,
  ValidateNested,
} from 'class-validator';

export class UpdateSubcategoryDto extends PartialType(CreateSubcategoryDto) {
  @IsEmpty()
  category_id: number;

  @IsEmpty()
  order: number;
}

export class UpdateSubcategoryOrdersDto {
  @IsNotEmpty()
  @IsNumber()
  category_id: number;

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  orders: {
    id: number;
    order: number;
  }[];
}
