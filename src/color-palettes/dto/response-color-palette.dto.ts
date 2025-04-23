import { Expose, Transform, Type } from 'class-transformer';
import { RestaurantResponseDto } from 'src/restaurants/dto/response-restaurant.dto';

export class ColorPaletteResponseDto {
  @Expose()
  name: string;

  @Expose()
  background: string;

  @Expose()
  foreground: string;

  @Expose()
  primary: string;

  @Expose()
  primary_foreground: string;

  @Expose()
  @Type(() => RestaurantResponseDto)
  @Transform(({ value }) => {
    console.log(value);
  })
  restaurant_id: number;
}
