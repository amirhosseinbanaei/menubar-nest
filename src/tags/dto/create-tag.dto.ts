import { Transform, Type } from 'class-transformer';
import { IsArray, IsNumber, ValidateNested } from 'class-validator';
import { CreateTranslationDto } from 'src/languages/dto/create-translation.dto';

export class CreateTagDto {
  @IsNumber()
  @Type(() => Number)
  restaurant_id: number;

  image?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateTranslationDto)
  @Transform(({ value }) =>
    typeof value === 'string' ? JSON.parse(value) : value,
  )
  translations: CreateTranslationDto[];
}
