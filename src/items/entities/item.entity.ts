import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Category } from '../../categories/entities/category.entity';
import { Subcategory } from '../../subcategories/entities/subcategory.entity';
import { Restaurant } from '../../restaurants/entities/restaurant.entity';
import { ItemTranslation } from './item-translation.entity';
import { ExtraItem } from '../../extra-items/entities/extra-item.entity';
import { Tag } from '../../tags/tag.entity';

@Entity()
export class Item {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 512 })
  image: string;

  @Column()
  price: number;

  @Column()
  discount: number;

  @Column()
  order: number;

  @Column()
  is_hide: boolean;

  @Column()
  is_available: boolean;

  @ManyToOne(() => Category, (category) => category.items, {
    onDelete: 'SET NULL',
  })
  category: Category;

  @ManyToOne(() => Subcategory, { onDelete: 'SET NULL' })
  subcategory: Subcategory;

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.items)
  restaurant: Restaurant;

  @OneToMany(() => ItemTranslation, (translation) => translation.item)
  translations: ItemTranslation[];

  @OneToMany(() => Tag, (tag) => tag.item)
  tags: Tag[];

  @OneToMany(() => ExtraItem, (extraItem) => extraItem.item)
  extraItems: ExtraItem[];
}
