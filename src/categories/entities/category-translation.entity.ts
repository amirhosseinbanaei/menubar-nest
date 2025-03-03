import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Category } from './category.entity';
import { Language } from '../../languages/entities/language.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class CategoryTranslation {
  @Exclude()
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  name: string;

  @ManyToOne(() => Category, (category) => category.translations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @ManyToOne(() => Language, (language) => language.categoryTranslations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'language_code' })
  language: Language;
}
