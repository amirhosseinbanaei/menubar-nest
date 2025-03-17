import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Category } from '../../categories/entities/category.entity';
import { Item } from '../../items/entities/item.entity';
import { ExtraItem } from '../../extra-items/entities/extra-item.entity';
import { Tag } from '../../tags/entities/tag.entity';
import { TableReservation } from '../../reservations/entities/reservation.entity';
import { RestaurantWorkingHours } from './restaurant-hours.entity';
import { Language } from 'src/languages/entities/language.entity';
import { RestaurantInformation } from './restaurant-information.entity';

@Entity()
export class Restaurant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 512, nullable: true })
  logo: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @ManyToMany(() => Language, (language) => language.restaurantLanguages)
  @JoinTable()
  languages: Language[];

  @OneToMany(
    () => RestaurantInformation,
    (translation) => translation.restaurant,
  )
  translations: RestaurantInformation[];

  @OneToMany(() => Category, (category) => category.restaurant, {
    cascade: true,
  })
  categories: Category[];

  @OneToMany(() => Item, (item) => item.restaurant)
  items: Item[];

  @OneToMany(() => ExtraItem, (extraItem) => extraItem.restaurant)
  extraItems: ExtraItem[];

  @OneToMany(() => Tag, (tag) => tag.restaurant)
  tags: Tag[];

  @OneToMany(() => TableReservation, (reservation) => reservation.restaurant)
  reservations: TableReservation[];

  @OneToMany(() => RestaurantWorkingHours, (rw) => rw.restaurant)
  workingHours: RestaurantWorkingHours[];
}
