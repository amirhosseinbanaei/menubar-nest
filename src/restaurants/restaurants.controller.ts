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
  Query,
  BadRequestException,
} from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { CustomFileInterceptor } from 'src/common/interceptors/file.interceptor';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { OrdersService } from 'src/orders/orders.service';
import { PaginationDto } from 'src/orders/dto/pagination.dto';
import { FilterOrderDto } from 'src/orders/dto/filter-order.dto';
import { FilterRestaurantDto } from './dto/filter-restaurant.dto';

@Controller('restaurants')
export class RestaurantsController {
  constructor(
    private readonly restaurantsService: RestaurantsService,
    private readonly ordersService: OrdersService,
  ) {}

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

  @Get('orders/:restaurant_id')
  findAllOrders(
    @Param('restaurant_id', ParseIntPipe) restaurant_id: number,
    @Query() paginationDto: PaginationDto = { limit: 10, page: 1 },
    @Query() filterDto?: FilterOrderDto,
  ) {
    return this.ordersService.findAll(
      undefined,
      restaurant_id,
      undefined,
      paginationDto,
      filterDto,
    );
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Query('all-options') allOptions?: boolean,
    @Query() filterDto?: FilterRestaurantDto,
  ) {
    if (filterDto.filter && allOptions)
      throw new BadRequestException(
        'You should send just all options query or filter query !',
      );

    return this.restaurantsService.findOne(id, {
      serialize: true,
      ...((allOptions || filterDto.filter) && {
        fields: allOptions ? 'all' : filterDto,
      }),
    });
  }

  // @Get(':id/information')
  // findOneWithInformation(@Param('id', ParseIntPipe) id: number) {
  //   return this.restaurantsService.findOne(id, {
  //     serialize: true,
  //     extraRelation: ['socials', 'workingHours'],
  //   });
  // }

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
