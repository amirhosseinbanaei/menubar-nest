import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Restaurant } from './restaurant.entity';

@Entity('restaurant_assets')
export class RestaurantAsset {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.assets, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'restaurant_id' })
  restaurant: Restaurant;

  @Column({
    type: 'enum',
    enum: ['logo', 'banner', 'icon', 'video'],
    default: 'logo',
  })
  type: 'logo' | 'banner' | 'icon' | 'video';

  @Column({ type: 'varchar' })
  url: string;

  @Column({ nullable: true })
  width: number;

  @Column({ nullable: true })
  height: number;

  @Column({ type: 'varchar', nullable: true })
  size_label: string; // e.g. '192x192', 'small', 'mobile', etc.

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
}
