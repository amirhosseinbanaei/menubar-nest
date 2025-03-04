import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  ValidateNested,
} from 'class-validator';

class EntityOrderDto {
  @IsNumber()
  id: number;
  @IsNumber()
  order: number;
}

export class ListingOrderDto {
  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  category_id?: number;

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  orders: EntityOrderDto[];
}
