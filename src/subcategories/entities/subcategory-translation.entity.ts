import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Language } from '../../languages/entities/language.entity';
import { Subcategory } from './subcategory.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class SubcategoryTranslation {
  @Exclude()
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  name: string;

  @ManyToOne(() => Subcategory, (subCategory) => subCategory.translations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'subcategory_id' })
  subcategory: Subcategory;

  @ManyToOne(() => Language, (language) => language.subcategoryTranslations, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn({ name: 'language_code' })
  language: Language;
}
