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
import { ExtraItem } from './entities/extra-item.entity';
import { ItemTranslation } from './entities/item-translation.entity';
import { Tag } from './entities/tag.entity';
import { TagTranslation } from './entities/tag-translation.entity';
import { ExtraItemTranslation } from './entities/extra-item-translation.entity';
import { CheckQueryLanguageMiddleware } from 'src/common/middlewares/language.middleware';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Language,
      Item,
      ItemTranslation,
      ExtraItem,
      ExtraItemTranslation,
      Tag,
      TagTranslation,
    ]),
  ],
  controllers: [ItemsController],
  providers: [ItemsService],
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
