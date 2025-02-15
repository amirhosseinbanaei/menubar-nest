import {
  Controller,
  Get,
  // Post,
  // Body,
  Param,
  Delete,
  // UseInterceptors,
  // ClassSerializerInterceptor,
} from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
// import { RestaurantsLanguageService } from './restaurant-language.service';
// import { CreateRestaurantDto } from './dto/restaurant.dto';

@Controller('restaurants')
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  // @Post()
  // create(@Body() createRestaurantDto: CreateRestaurantDto) {
  //   return this.restaurantsService.create(createRestaurantDto);
  // }

  // @Post('/languages')
  // @UseInterceptors(ClassSerializerInterceptor)
  // addRestaurantLanguage(
  //   @Body() createRestaurantDto: CreateRestaurantLanguageDto,
  // ) {
  //   return this.restaurantLanguageService.addLanguageToRestaurant(
  //     createRestaurantDto,
  //   );
  // }

  @Get()
  findAll() {
    return this.restaurantsService.findAll();
  }

  // @Get('/languages')
  // findAllRestaurantLanguages() {
  //   return this.restaurantLanguageService.findAllRestaurantLanguages();
  // }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.restaurantsService.findOne(+id);
  }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateRestaurantDto: UpdateRestaurantDto,
  // ) {
  //   return this.restaurantsService.update(+id, updateRestaurantDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.restaurantsService.remove(+id);
  }
}
