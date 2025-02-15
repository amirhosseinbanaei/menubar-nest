import { Entity, PrimaryColumn, Column, ManyToOne } from 'typeorm';
import { Category } from './category.entity';
import { Language } from '../../languages/entities/language.entity';

@Entity()
export class CategoryTranslation {
  @PrimaryColumn()
  category_id: number;

  @PrimaryColumn()
  language_id: number;

  @Column({ length: 255 })
  translated_name: string;

  @ManyToOne(() => Category, (category) => category.translations)
  category: Category;

  @ManyToOne(() => Language, (language) => language.categoryTranslations)
  language: Language;
}
