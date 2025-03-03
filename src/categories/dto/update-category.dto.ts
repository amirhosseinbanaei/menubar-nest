import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoryDto } from './create-category.dto';
import { IsArray, IsNotEmpty, ValidateNested } from 'class-validator';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}

export class UpdateCategoryOrdersDto {
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  orders: {
    id: number;
    order: number;
  }[];
}
