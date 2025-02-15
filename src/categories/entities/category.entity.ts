import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Restaurant } from '../../restaurants/entities/restaurant.entity';
import { Subcategory } from './subcategory.entity';
import { CategoryTranslation } from './category-translation.entity';
import { Item } from '../../items/entities/item.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 512 })
  icon: string;

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.categories)
  restaurant: Restaurant;

  @OneToMany(() => Subcategory, (subcategory) => subcategory.category)
  subcategories: Subcategory[];

  @OneToMany(
    () => CategoryTranslation,
    (categoryTranslation) => categoryTranslation.category,
  )
  translations: CategoryTranslation[];

  @OneToMany(() => Item, (item) => item.category)
  items: Item[];
}
