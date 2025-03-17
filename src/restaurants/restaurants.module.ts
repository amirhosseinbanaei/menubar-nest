import { Module } from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { RestaurantsController } from './restaurants.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Restaurant } from './entities/restaurant.entity';
import { Language } from '../languages/entities/language.entity';
import { RestaurantInformation } from './entities/restaurant-information.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Language, Restaurant, RestaurantInformation]),
  ],
  controllers: [RestaurantsController],
  providers: [RestaurantsService],
  exports: [RestaurantsService],
})
export class RestaurantsModule {}
