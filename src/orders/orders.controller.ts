import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  // UseGuards,
  // Req,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OrderStatus } from './entities/order.entity';
import { PaginationDto } from './dto/pagination.dto';
import { FilterOrderDto } from './dto/filter-order.dto';

@Controller('orders')
// @UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }

  @Get()
  findAll(
    // @Req() req,
    @Query('restaurant_id') restaurantId?: number,
    @Query('status') status?: OrderStatus,
    @Query() paginationDto?: PaginationDto,
    @Query() filterDto?: FilterOrderDto,
  ) {
    return this.ordersService.findAll(
      // req.user.id,
      2,
      restaurantId,
      status,
      paginationDto,
      filterDto,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(+id, updateOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordersService.remove(+id);
  }
}
