import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Item } from './item.entity';
import { TagTranslation } from './entities/tag-translation.entity';

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
