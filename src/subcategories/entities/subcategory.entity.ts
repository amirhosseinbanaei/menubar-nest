import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  Column,
} from 'typeorm';
import { Category } from '../../categories/entities/category.entity';
import { SubcategoryTranslation } from './subcategory-translation.entity';
import { Item } from 'src/items/entities/item.entity';

@Entity()
export class Subcategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  order: number;

  @OneToMany(
    () => SubcategoryTranslation,
    (subCategoryTranslation) => subCategoryTranslation.subcategory,
    { cascade: true, onDelete: 'CASCADE', eager: true },
  )
  translations: SubcategoryTranslation[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @ManyToOne(() => Category, (category) => category.subcategories, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @OneToMany(() => Item, (item) => item.subcategory, {
    onDelete: 'NO ACTION',
  })
  @JoinColumn({ name: 'item_id' })
  items: Item[];
}
