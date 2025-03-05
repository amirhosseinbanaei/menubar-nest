import {
  Entity,
  Column,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';
import { Language } from '../../languages/entities/language.entity';
import { Exclude } from 'class-transformer';
import { ExtraItem } from './extra-item.entity';

@Entity()
export class ExtraItemTranslation {
  @Exclude()
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  name: string;

  @ManyToOne(() => ExtraItem, (extraItem) => extraItem.translations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'extra_item_id' })
  extraItem: ExtraItem;

  @ManyToOne(() => Language, (language) => language.tagTranslations, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn({ name: 'language' })
  language: Language;
}
