import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { RestaurantsController } from './restaurants.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Restaurant } from './entities/restaurant.entity';
import { LanguagesService } from '../languages/languages.service';
import { Language } from '../languages/entities/language.entity';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { RestaurantTranslation } from './entities/restaurant-translation.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Language, Restaurant, RestaurantTranslation]),
  ],
  controllers: [RestaurantsController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
    RestaurantsService,
    LanguagesService,
  ],
  exports: [RestaurantsService],
})
export class RestaurantsModule {}
