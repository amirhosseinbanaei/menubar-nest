import {
  IsNumber,
  IsEnum,
  IsOptional,
  ValidateNested,
  IsArray,
  IsDate,
  IsPositive,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PaymentType } from '../entities/order.entity';

class OrderItemExtraItemDto {
  @IsNumber()
  @IsPositive()
  id: number;

  @IsNumber()
  @Min(1)
  quantity: number;

  @IsNumber()
  @IsPositive()
  price: number;
}

export class OrderItemDto {
  @IsNumber()
  @IsPositive()
  id: number;

  @IsNumber()
  @Min(1)
  quantity: number;

  @IsNumber()
  @IsPositive()
  price: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemExtraItemDto)
  extra_items?: OrderItemExtraItemDto[];
}

export class CreateOrderDto {
  @IsNumber()
  user_id: number;

  @IsNumber()
  restaurant_id: number;

  @IsNumber()
  @IsPositive()
  table_number: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @IsEnum(PaymentType)
  payment_type: PaymentType;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  scheduled_pickup_time?: Date;
}
