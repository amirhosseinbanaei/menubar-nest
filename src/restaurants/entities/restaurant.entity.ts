import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { RestaurantTranslation } from './restaurant-translation.entity';
import { Category } from '../../categories/entities/category.entity';
import { Item } from '../../items/entities/item.entity';
import { ExtraItem } from '../../extra-items/entities/extra-item.entity';

@Entity()
export class Restaurant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 512, nullable: true })
  logo: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @OneToMany(
    () => RestaurantTranslation,
    (translation) => translation.restaurant,
  )
  translations: RestaurantTranslation[];

  @OneToMany(() => Category, (category) => category.restaurant, {
    cascade: true,
  })
  categories: Category[];

  @OneToMany(() => Item, (item) => item.restaurant)
  items: Item[];

  @OneToMany(() => ExtraItem, (extraItem) => extraItem.restaurant)
  extraItems: ExtraItem[];
}
