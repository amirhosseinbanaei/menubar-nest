import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Category } from '../../categories/entities/category.entity';
import { Subcategory } from '../../subcategories/entities/subcategory.entity';
import { Restaurant } from '../../restaurants/entities/restaurant.entity';
import { ItemTranslation } from './item-translation.entity';
import { ExtraItem } from '../../extra-items/entities/extra-item.entity';
import { Tag } from '../../tags/entities/tag.entity';

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
  is_hidden: boolean;

  @Column()
  is_available: boolean;

  @ManyToOne(() => Category, (category) => category.items, {
    onDelete: 'SET NULL',
  })
  category: Category;

  @ManyToOne(() => Subcategory, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  subcategory: Subcategory | null;

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.items)
  restaurant: Restaurant;

  @OneToMany(() => ItemTranslation, (translation) => translation.item)
  translations: ItemTranslation[];

  @ManyToMany(() => Tag, (tag) => tag.item, { onDelete: 'CASCADE' })
  @JoinTable()
  tags: Tag[];

  @ManyToMany(() => ExtraItem, (extraItem) => extraItem.item, {
    onDelete: 'CASCADE',
  })
  @JoinTable()
  extraItems: ExtraItem[];
}
