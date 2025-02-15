import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Item } from './item.entity';
import { Restaurant } from '../../restaurants/entities/restaurant.entity';
import { ExtraItemTranslation } from './extra-item-translation.entity';

@Entity()
export class ExtraItem {
  @PrimaryGeneratedColumn()
  extra_item_id: number;

  @ManyToOne(() => Item, (item) => item.extraItems, { onDelete: 'CASCADE' })
  item: Item;

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.extraItems, {
    onDelete: 'CASCADE',
  })
  restaurant: Restaurant;

  @Column({ length: 512 })
  image: string;

  @Column()
  price: number;

  @OneToMany(() => ExtraItemTranslation, (translation) => translation.extraItem)
  translations: ExtraItemTranslation[];
}
