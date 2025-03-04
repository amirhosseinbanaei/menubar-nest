import { Module } from '@nestjs/common';
import { ListingOrdersService } from './listing-orders.service';
import { ListingOrdersController } from './listing-orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from 'src/categories/entities/category.entity';
import { Subcategory } from 'src/subcategories/entities/subcategory.entity';
import { Item } from 'src/items/entities/item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Category, Subcategory, Item])],
  controllers: [ListingOrdersController],
  providers: [ListingOrdersService],
})
export class ListingOrdersModule {}
