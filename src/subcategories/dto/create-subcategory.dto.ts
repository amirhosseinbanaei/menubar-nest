import { Type } from 'class-transformer';
import { IsArray, IsNumber, ValidateNested } from 'class-validator';
import { CreateTranslationDto } from '../../languages/dto/create-translation.dto';

export class CreateSubcategoryDto {
  @IsNumber()
  category_id: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateTranslationDto)
  translations: CreateTranslationDto[];
}
