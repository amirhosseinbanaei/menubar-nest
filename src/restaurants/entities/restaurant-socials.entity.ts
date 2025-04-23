import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Restaurant } from './restaurant.entity';

export enum SocialPlatform {
  INSTAGRAM = 'instagram',
  GOOGLEMAP = 'googlemap',
  PHONE = 'phone',
  WAZE = 'waze',
  NESHAN = 'neshan',
  BALAD = 'balad',
}

@Entity('restaurant_socials')
export class RestaurantSocial {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: SocialPlatform,
  })
  platform: SocialPlatform;

  @Column()
  url: string;

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.socials, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'restaurant_id' })
  restaurant: Restaurant;
}
