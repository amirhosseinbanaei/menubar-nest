import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Restaurant } from '../../restaurants/entities/restaurant.entity';

@Entity('table_reservations')
export class TableReservation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  reservation_date: Date;

  @Column({ type: 'time' })
  start_time: string;

  @Column({ type: 'int', nullable: true })
  duration_minutes: number;

  @Column({ type: 'int' })
  number_of_persons: number;

  @Column({ nullable: true })
  table_number: string;

  @Column()
  reserver_full_name: string;

  @Column({ default: 'pending' })
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';

  @Column({ nullable: true })
  notes: string;

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.reservations)
  restaurant: Restaurant;

  @ManyToOne(() => User, (user) => user.reservations, { nullable: true })
  user: User;

  @CreateDateColumn()
  created_at: Date;
}
