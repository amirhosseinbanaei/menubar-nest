import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
import { RestaurantTranslation } from '../../restaurants/entities/restaurant-translation.entity';
import { CategoryTranslation } from '../../categories/entities/category-translation.entity';
import { ItemTranslation } from '../../items/entities/item-translation.entity';
import { TagTranslation } from '../../items/entities/tag-translation.entity';
import { ExtraItemTranslation } from '../../items/entities/extra-item-translation.entity';

@Entity()
export class Language {
  @PrimaryColumn({ length: 5 })
  language_code: string;

  @Column({ length: 100, unique: true })
  language_name: string;

  @Column({ nullable: true, unique: true })
  branch_id: number;

  @OneToMany(() => RestaurantTranslation, (translation) => translation.language)
  restaurantTranslations: RestaurantTranslation[];

  @OneToMany(() => CategoryTranslation, (translation) => translation.language)
  categoryTranslations: CategoryTranslation[];

  @OneToMany(() => ItemTranslation, (translation) => translation.language)
  itemTranslations: ItemTranslation[];

  @OneToMany(() => TagTranslation, (translation) => translation.language)
  tagTranslations: TagTranslation[];

  @OneToMany(() => ExtraItemTranslation, (translation) => translation.language)
  extraItemTranslations: ExtraItemTranslation[];
}
