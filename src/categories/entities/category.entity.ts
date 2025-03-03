import {
  Entity,
  Column,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Restaurant } from '../../restaurants/entities/restaurant.entity';
import { Subcategory } from '../../subcategories/entities/subcategory.entity';
import { CategoryTranslation } from './category-translation.entity';
import { Item } from '../../items/entities/item.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 512 })
  image: string;

  @Column({ nullable: false, default: 0 })
  order: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.categories)
  restaurant: Restaurant;

  @OneToMany(() => Subcategory, (subcategory) => subcategory.category, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  subcategories: Subcategory[];

  @OneToMany(
    () => CategoryTranslation,
    (categoryTranslation) => categoryTranslation.category,
    { cascade: true, onDelete: 'CASCADE' },
  )
  translations: CategoryTranslation[];

  @OneToMany(() => Item, (item) => item.category)
  items: Item[];
}
