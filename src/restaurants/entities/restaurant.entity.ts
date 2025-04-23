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
import { RestaurantTranslation } from './restaurant-translation.entity';
import { Order } from 'src/orders/entities/order.entity';
import { RestaurantSocial } from './restaurant-socials.entity';
import { ColorPalettes } from 'src/color-palettes/entities/color-palette.entity';
import { Admin } from 'src/admins/entities/admin.entity';

@Entity('restaurants')
export class Restaurant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ nullable: true })
  color_palette_id: number;

  @OneToMany(() => Admin, (admin) => admin.restaurant, { nullable: false })
  admin: Admin[];

  @ManyToMany(() => Language, (language) => language.restaurantLanguages, {
    eager: true,
  })
  @JoinTable({
    name: 'restaurant_lanuages', // Custom name for the junction table
    inverseJoinColumn: {
      name: 'language', // Custom name for the join column referencing the Question entity
      referencedColumnName: 'language_code',
    },
    joinColumn: {
      name: 'restaurant_id', // Custom name for the join column referencing the Post entity
      referencedColumnName: 'id',
    },
  })
  languages: Language[];

  @OneToMany(
    () => RestaurantTranslation,
    (translation) => translation.restaurant,
  )
  translations: RestaurantTranslation[];

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

  @OneToMany(() => RestaurantSocial, (rs) => rs.restaurant)
  socials: RestaurantSocial[];

  @OneToMany(() => Order, (order) => order.restaurant, { nullable: false })
  orders: Order[];

  @OneToMany(() => Order, (order) => order.restaurant, { nullable: false })
  assets: Order[];

  @OneToMany(() => ColorPalettes, (cp) => cp.restaurant, {
    nullable: false,
    cascade: true,
  })
  colorPalettes: ColorPalettes;

  // @OneToOne(() => ColorPalettes, (cp) => cp.restaurant, { nullable: false })
  // @JoinTable({ name: 'color_palette_id' })
  // colorPalettes: ColorPalettes;
  // @ManyToOne(() => Restaurant, (restaurant) => restaurant.items)
  // restaurant: Restaurant;
}
