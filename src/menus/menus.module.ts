import { Module } from '@nestjs/common';
import { MenusService } from './menus.service';
import { MenusController } from './menus.controller';
import { CategoriesModule } from 'src/categories/categories.module';
import { ItemsModule } from 'src/items/items.module';

@Module({
  imports: [CategoriesModule, ItemsModule],
  controllers: [MenusController],
  providers: [MenusService],
})
export class MenusModule {}
