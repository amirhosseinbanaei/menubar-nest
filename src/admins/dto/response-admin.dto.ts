import { Expose, Exclude, Type, Transform } from 'class-transformer';
import { RestaurantResponseDto } from 'src/restaurants/dto/response-restaurant.dto';

@Exclude()
export class AdminResponseDto {
  @Expose()
  id: number;

  @Expose()
  full_name: string;

  @Expose()
  email: string;

  @Expose()
  @Type(() => RestaurantResponseDto)
  @Transform(({ obj }) => obj.restaurant?.id ?? null, {
    toClassOnly: true,
  })
  restaurant_id: number | null;

  @Expose()
  phone_number: string;

  @Expose()
  is_active: boolean;

  @Expose()
  created_at: Date;

  @Expose()
  updated_at: Date;
}
