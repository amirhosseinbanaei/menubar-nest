import { Expose } from 'class-transformer';
import { OrderStatus, PaymentType } from '../entities/order.entity';

export class OrderResponseDto {
  @Expose()
  id: number;

  @Expose()
  total_amount: number;

  @Expose()
  discount_amount: number;

  @Expose()
  final_amount: number;

  @Expose()
  status: OrderStatus;

  @Expose()
  payment_type: PaymentType;

  @Expose()
  scheduled_pickup_time: Date;

  @Expose()
  items: {
    item_id: number;
    quantity: number;
    unit_price: number;
    total_price: number;
    extra_item_id?: number;
    notes?: string;
  }[];

  @Expose()
  delivery_address?: {
    street: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };

  @Expose()
  user: {
    id: number;
    full_name: string;
    phone_number: string;
  };

  @Expose()
  restaurant: {
    id: number;
    name: string;
  };

  @Expose()
  table_number: number;
  @Expose()
  created_at: Date;

  @Expose()
  updated_at: Date;
}
