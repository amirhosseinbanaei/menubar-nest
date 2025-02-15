import { Entity, PrimaryColumn, Column, ManyToOne } from 'typeorm';
import { Restaurant } from './restaurant.entity';
import { Language } from '../../languages/entities/language.entity';

@Entity()
export class RestaurantTranslation {
  @PrimaryColumn()
  restaurant_id: number;

  @PrimaryColumn({ length: 5 })
  language_code: string;

  @Column({ length: 255 })
  name: string;

  @Column('text')
  description: string;

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.translations, {
    onDelete: 'CASCADE',
  })
  restaurant: Restaurant;

  @ManyToOne(() => Language, (language) => language.restaurantTranslations, {
    onDelete: 'CASCADE',
  })
  language: Language;
}
