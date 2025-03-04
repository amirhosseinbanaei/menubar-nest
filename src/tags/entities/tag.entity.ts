import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { TagTranslation } from './tag-translation.entity';
import { Item } from '../../items/entities/item.entity';
import { Restaurant } from '../../restaurants/entities/restaurant.entity';

@Entity()
export class Tag {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Item, (item) => item.tags, { onDelete: 'CASCADE' })
  item: Item;

  @Column({ length: 512 })
  image: string;

  @OneToMany(() => TagTranslation, (translation) => translation.tag)
  translations: TagTranslation[];

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.items)
  restaurant: Restaurant;
}
