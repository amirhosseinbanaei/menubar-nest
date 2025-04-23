import {
  Entity,
  Column,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';
import { Item } from './item.entity';
import { Language } from '../../languages/entities/language.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class ItemTranslation {
  @Exclude()
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  name: string;

  @Column({ length: 5000 })
  description: string;

  @ManyToOne(() => Item, (item) => item.translations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'item_id' })
  item: Item;

  @ManyToOne(() => Language, (language) => language.itemTranslations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'language_code' })
  language: Language;
}
