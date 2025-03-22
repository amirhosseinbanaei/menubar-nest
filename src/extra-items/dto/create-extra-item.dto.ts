import { IsArray, IsBoolean, IsNumber, ValidateNested } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { CreateTranslationDto } from '../../languages/dto/create-translation.dto';

export class CreateExtraItemDto {
  @IsNumber()
  @Type(() => Number)
  restaurant_id: number;

  @IsNumber()
  @Type(() => Number)
  branch_id: number;

  @IsNumber()
  @Type(() => Number)
  price: number;

  @IsBoolean()
  @Type(() => Boolean)
  is_hidden: boolean;

  image?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateTranslationDto)
  @Transform(({ value }) =>
    typeof value === 'string' ? JSON.parse(value) : value,
  )
  translations: CreateTranslationDto[];
}
