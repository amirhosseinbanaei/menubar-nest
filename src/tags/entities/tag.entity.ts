import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { TagTranslation } from './tag-translation.entity';
import { Item } from '../../items/entities/item.entity';

@Entity()
export class Tag {
  @PrimaryGeneratedColumn()
  tag_id: number;

  @ManyToOne(() => Item, (item) => item.tags, { onDelete: 'CASCADE' })
  item: Item;

  @Column({ length: 512 })
  image: string;

  @OneToMany(() => TagTranslation, (translation) => translation.tag)
  translations: TagTranslation[];
}
