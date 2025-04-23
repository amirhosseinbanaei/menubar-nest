import { IsArray, IsNumber, IsOptional, ValidateNested } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { CreateTranslationDto } from '../../languages/dto/create-translation.dto';

export class CreateCategoryDto {
  @IsNumber()
  @Type(() => Number)
  restaurant_id: number;

  @IsNumber()
  @Type(() => Number)
  branch_id: number;

  @IsOptional()
  image?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateTranslationDto)
  @Transform(({ value }) =>
    typeof value === 'string' ? JSON.parse(value) : value,
  )
  translations: CreateTranslationDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateTranslationDto)
  @Transform(({ value }) =>
    typeof value === 'string' ? JSON.parse(value) : value,
  )
  subcategories: {
    translations: CreateTranslationDto[];
  }[];
}
