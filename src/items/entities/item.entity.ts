import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Category } from '../../categories/entities/category.entity';
import { Subcategory } from '../../categories/entities/subcategory.entity';
import { Restaurant } from '../../restaurants/entities/restaurant.entity';
import { ItemTranslation } from './item-translation.entity';
import { Tag } from './tag.entity';
import { ExtraItem } from './extra-item.entity';

@Entity()
export class Item {
  @PrimaryGeneratedColumn()
  item_id: number;

  @ManyToOne(() => Category, (category) => category.items, {
    onDelete: 'CASCADE',
  })
  category: Category;

  @ManyToOne(() => Subcategory, { onDelete: 'CASCADE' })
  subcategory: Subcategory;

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.items, {
    onDelete: 'CASCADE',
  })
  restaurant: Restaurant;

  @Column({ length: 512 })
  image: string;

  @Column()
  price: number;

  @Column()
  discount: number;

  @Column()
  is_hide: boolean;

  @Column()
  is_available: boolean;

  @OneToMany(() => ItemTranslation, (translation) => translation.item)
  translations: ItemTranslation[];

  @OneToMany(() => Tag, (tag) => tag.item)
  tags: Tag[];

  @OneToMany(() => ExtraItem, (extraItem) => extraItem.item)
  extraItems: ExtraItem[];
}
