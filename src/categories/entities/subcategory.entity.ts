import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Category } from './category.entity';
import { Language } from '../../languages/entities/language.entity';

@Entity()
export class Subcategory {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Category, (category) => category.subcategories, {
    onDelete: 'CASCADE',
  })
  category: Category;

  @ManyToOne(() => Language, { onDelete: 'CASCADE' })
  language: Language;

  @Column({ length: 255 })
  name: string;
}
