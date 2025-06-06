import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ItemsService } from './items.service';
import { ItemsController } from './items.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Language } from '../languages/entities/language.entity';
import { Item } from './entities/item.entity';
import { ItemTranslation } from './entities/item-translation.entity';
import { CheckQueryLanguageMiddleware } from 'src/common/middlewares/language.middleware';
import { TagsModule } from 'src/tags/tags.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Language, Item, ItemTranslation]),
    TagsModule,
  ],
  controllers: [ItemsController],
  providers: [ItemsService],
  exports: [ItemsService],
})
export class ItemsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CheckQueryLanguageMiddleware)
      .forRoutes({
        path: 'items',
        method: RequestMethod.GET,
      })
      .apply(CheckQueryLanguageMiddleware)
      .forRoutes({
        path: 'items/:id',
        method: RequestMethod.GET,
      });
  }
}
