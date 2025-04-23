import { Restaurant } from 'src/restaurants/entities/restaurant.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('color_palettes')
export class ColorPalettes {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  background: string;

  @Column()
  foreground: string;

  @Column()
  primary: string;

  @Column()
  primary_foreground: string;

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.colorPalettes, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'restaurant_id' })
  restaurant: Restaurant | null; // Assuming each color palette is associated with a restaurant
}
