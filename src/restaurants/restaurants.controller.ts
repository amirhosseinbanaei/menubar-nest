import {
  Controller,
  Get,
  Param,
  Delete,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
  Patch,
  ParseIntPipe,
} from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { CustomFileInterceptor } from 'src/common/interceptors/file.interceptor';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';

@Controller('restaurants')
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @Post()
  @UseInterceptors(
    CustomFileInterceptor('logo', './uploads/companies', 'image'),
  )
  create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createRestaurantDto: CreateRestaurantDto,
  ) {
    return this.restaurantsService.create(createRestaurantDto);
  }

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
    return this.restaurantsService.findAll({ serialize: true });
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.restaurantsService.findOne(id, { serialize: true });
  }

  @Patch(':id')
  @UseInterceptors(
    CustomFileInterceptor('logo', './uploads/companies', 'image'),
  )
  update(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
    @Body() updateRestaurantDto: UpdateRestaurantDto,
  ) {
    return this.restaurantsService.update(id, updateRestaurantDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.restaurantsService.remove(+id);
  }
}
