import { Entity, PrimaryColumn, Column, ManyToOne } from 'typeorm';
import { Tag } from './tag.entity';
import { Language } from '../../languages/entities/language.entity';

@Entity()
export class TagTranslation {
  @PrimaryColumn()
  tag_id: number;

  @PrimaryColumn({ length: 5 })
  language_code: string;

  @Column({ length: 255 })
  translated_name: string;

  @Column({ length: 255 })
  translated_description: string;

  @ManyToOne(() => Tag, (tag) => tag.translations, { onDelete: 'CASCADE' })
  tag: Tag;

  @ManyToOne(() => Language, (language) => language.tagTranslations, {
    onDelete: 'CASCADE',
  })
  language: Language;
}
