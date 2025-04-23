import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Restaurant } from '../../restaurants/entities/restaurant.entity';
import { TagTranslation } from './tag-translation.entity';
import { Item } from '../../items/entities/item.entity';

@Entity('tags')
export class Tag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 512 })
  image: string;

  @Column({ default: true })
  is_active: boolean;

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.tags)
  restaurant: Restaurant;

  @OneToMany(() => TagTranslation, (translation) => translation.tag, {
    eager: true,
  })
  translations: TagTranslation[];

  @OneToMany(() => Item, (item) => item.tags)
  items: Item[];
}
