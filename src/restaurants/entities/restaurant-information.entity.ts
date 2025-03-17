import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Restaurant } from './restaurant.entity';
import { Language } from '../../languages/entities/language.entity';

@Entity('restaurant_information')
export class RestaurantInformation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  name: string;

  @Column('text')
  description: string;

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.translations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'restaurant_id' })
  restaurant: Restaurant;

  @ManyToOne(() => Language, (language) => language.restaurantInformation, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'language' })
  language: Language;
}
