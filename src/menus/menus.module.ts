import { Module } from '@nestjs/common';
import { MenusService } from './menus.service';
import { MenusController } from './menus.controller';
import { CategoriesModule } from 'src/categories/categories.module';
import { ItemsModule } from 'src/items/items.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from 'src/categories/entities/category.entity';
import { Item } from 'src/items/entities/item.entity';

@Module({
  imports: [
    CategoriesModule,
    ItemsModule,
    TypeOrmModule.forFeature([Category, Item]),
  ],
  controllers: [MenusController],
  providers: [MenusService],
})
export class MenusModule {}
