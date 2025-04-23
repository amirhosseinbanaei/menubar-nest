import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Restaurant } from '../../restaurants/entities/restaurant.entity';

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PREPARING = 'preparing',
  READY = 'ready',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum PaymentType {
  CASH = 'cash',
  ONLINE = 'online',
  PAY_AND_GET = 'pay_and_get',
}

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total_amount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  discount_amount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  final_amount: number;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status: OrderStatus;

  @Column({
    type: 'enum',
    enum: PaymentType,
  })
  payment_type: PaymentType;

  @Column()
  table_number: number;

  @Column({ type: 'timestamp', nullable: true })
  scheduled_pickup_time: Date;

  @Column({ type: 'json' })
  items: {
    id: number;
    quantity: number;
    price: number;
    extra_items?: {
      id: number;
      quantity: number;
      price: number;
    }[];
    notes?: string;
  }[];

  // @Column({ type: 'json', nullable: true })
  // delivery_address?: {
  //   street: string;
  //   city: string;
  //   state: string;
  //   postal_code: string;
  //   country: string;
  // };

  @ManyToOne(() => User, (user) => user.orders)
  user: User;

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.orders)
  restaurant: Restaurant;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
