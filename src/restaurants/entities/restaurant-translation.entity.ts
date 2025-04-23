import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Restaurant } from './restaurant.entity';
import { Language } from '../../languages/entities/language.entity';

@Entity('restaurant_translations')
export class RestaurantTranslation {
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

  @ManyToOne(() => Language, (language) => language.restaurantTranslation, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn({ name: 'language' })
  language: Language;
}
