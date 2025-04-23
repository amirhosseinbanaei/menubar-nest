import { Entity, PrimaryColumn, Column, OneToMany, ManyToMany } from 'typeorm';
import { CategoryTranslation } from '../../categories/entities/category-translation.entity';
import { ItemTranslation } from '../../items/entities/item-translation.entity';
import { Subcategory } from '../../subcategories/entities/subcategory.entity';
import { ExtraItemTranslation } from '../../extra-items/entities/extra-item-translation.entity';
import { TagTranslation } from 'src/tags/entities/tag-translation.entity';
import { Restaurant } from 'src/restaurants/entities/restaurant.entity';
import { RestaurantTranslation } from 'src/restaurants/entities/restaurant-translation.entity';

@Entity()
export class Language {
  @PrimaryColumn({ length: 5 })
  language_code: string;

  @Column({ length: 100, unique: true })
  language_name: string;

  @ManyToMany(() => Restaurant, (restaurant) => restaurant.languages)
  restaurantLanguages: Restaurant[];

  @OneToMany(() => RestaurantTranslation, (translation) => translation.language)
  restaurantTranslation: RestaurantTranslation[];

  @OneToMany(() => CategoryTranslation, (translation) => translation.language)
  categoryTranslations: CategoryTranslation[];

  @OneToMany(() => CategoryTranslation, (translation) => translation.language)
  subcategoryTranslations: Subcategory[];

  @OneToMany(() => ItemTranslation, (translation) => translation.language)
  itemTranslations: ItemTranslation[];

  @OneToMany(() => TagTranslation, (translation) => translation.language)
  tagTranslations: TagTranslation[];

  @OneToMany(() => ExtraItemTranslation, (translation) => translation.language)
  extraItemTranslations: ExtraItemTranslation[];
}
