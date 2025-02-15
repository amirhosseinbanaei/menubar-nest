import { Entity, PrimaryColumn, Column, ManyToOne } from 'typeorm';
import { Item } from './item.entity';
import { Language } from '../../languages/entities/language.entity';

@Entity()
export class ItemTranslation {
  @PrimaryColumn()
  item_id: number;

  @PrimaryColumn({ length: 5 })
  language_code: string;

  @Column({ length: 255 })
  translated_name: string;

  @ManyToOne(() => Item, (item) => item.translations, { onDelete: 'CASCADE' })
  item: Item;

  @ManyToOne(() => Language, (language) => language.itemTranslations, {
    onDelete: 'CASCADE',
  })
  language: Language;
}
