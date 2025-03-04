import { Entity, PrimaryColumn, Column, ManyToOne } from 'typeorm';
import { ExtraItem } from './extra-item.entity';
import { Language } from '../../languages/entities/language.entity';

@Entity()
export class ExtraItemTranslation {
  @PrimaryColumn()
  extra_item_id: number;

  @PrimaryColumn({ length: 5 })
  language_code: string;

  @Column({ length: 255 })
  translated_name: string;

  @ManyToOne(() => ExtraItem, (extraItem) => extraItem.translations, {
    onDelete: 'CASCADE',
  })
  extraItem: ExtraItem;

  @ManyToOne(() => Language, (language) => language.extraItemTranslations, {
    onDelete: 'CASCADE',
  })
  language: Language;
}
