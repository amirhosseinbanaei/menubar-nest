import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Order } from './entities/order.entity';
import { ItemsModule } from 'src/items/items.module';
import { ExtraItemsModule } from 'src/extra-items/extra-items.module';
import { UsersModule } from 'src/users/users.module';
import { RestaurantsModule } from 'src/restaurants/restaurants.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order]),
    ItemsModule,
    ExtraItemsModule,
    forwardRef(() => UsersModule),
    forwardRef(() => RestaurantsModule),
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
