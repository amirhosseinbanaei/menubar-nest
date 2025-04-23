import {
  IsOptional,
  IsEnum,
  IsDateString,
  Min,
  IsNumber,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { OrderStatus, PaymentType } from '../entities/order.entity';

export class FilterOrderDto {
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;

  @IsOptional()
  @IsEnum(PaymentType)
  payment_type?: PaymentType;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  user_id?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  restaurant_id?: number;

  @IsOptional()
  @IsDateString()
  start_date?: string;

  @IsOptional()
  @IsDateString()
  end_date?: string;

  @IsOptional()
  @IsNumber()
  min_amount?: number;

  @IsOptional()
  @IsNumber()
  max_amount?: number;

  @IsOptional()
  @IsString()
  search?: string;
}
