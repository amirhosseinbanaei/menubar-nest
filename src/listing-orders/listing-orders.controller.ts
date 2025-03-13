import { Controller, Body, Param, Put } from '@nestjs/common';
import { ListingOrdersService } from './listing-orders.service';
import { ListingOrderDto } from './listing-order.dto';

@Controller('listing-orders')
export class ListingOrdersController {
  constructor(private readonly listingOrdersService: ListingOrdersService) {}

  @Put(':entity')
  update(
    @Param('entity') entity: string,
    @Body() listingOrderDto: ListingOrderDto,
  ) {
    console.log(listingOrderDto);
    return this.listingOrdersService.updateOrders(entity, listingOrderDto);
  }
}
