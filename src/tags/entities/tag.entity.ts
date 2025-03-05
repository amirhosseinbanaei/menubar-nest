import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  ManyToMany,
} from 'typeorm';
import { TagTranslation } from './tag-translation.entity';
import { Item } from '../../items/entities/item.entity';
import { Restaurant } from '../../restaurants/entities/restaurant.entity';

@Entity()
export class Tag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 512 })
  image: string;

  @OneToMany(() => TagTranslation, (translation) => translation.tag, {
    eager: true,
  })
  translations: TagTranslation[];

  @ManyToMany(() => Item, (item) => item.tags, { onDelete: 'CASCADE' })
  item: Item[];

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.items)
  restaurant: Restaurant;
}
