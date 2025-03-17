import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Restaurant } from './restaurant.entity';

export enum WeekDay {
  MONDAY = 'monday',
  TUESDAY = 'tuesday',
  WEDNESDAY = 'wednesday',
  THURSDAY = 'thursday',
  FRIDAY = 'friday',
  SATURDAY = 'saturday',
  SUNDAY = 'sunday',
}

@Entity('restaurant_working_hours')
export class RestaurantWorkingHours {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: WeekDay,
  })
  day: WeekDay;

  @Column({ type: 'time' })
  open_time: string;

  @Column({ type: 'time' })
  close_time: string;

  @Column({ default: true })
  is_open: boolean;

  @ManyToOne(() => Restaurant, (r) => r.workingHours, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'restaurant_id' })
  restaurant: Restaurant;
}
