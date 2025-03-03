import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { Category } from './entities/category.entity';
import { Language } from '../languages/entities/language.entity';
import { CategoryTranslation } from './entities/category-translation.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CheckQueryLanguageMiddleware } from '../common/middlewares/language.middleware';
import { CheckCategoryExistMiddleware } from '../common/middlewares/category.middleware';

@Module({
  imports: [
    TypeOrmModule.forFeature([Language, Category, CategoryTranslation]),
  ],
  controllers: [CategoriesController],
  providers: [CategoriesService],
  exports: [CategoriesService],
})
export class CategoriesModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CheckQueryLanguageMiddleware)
      .forRoutes({
        path: 'categories',
        method: RequestMethod.GET,
      })
      .apply(CheckQueryLanguageMiddleware)
      .forRoutes({
        path: 'categories/:id',
        method: RequestMethod.GET,
      })
      .apply(CheckCategoryExistMiddleware)
      .forRoutes({ path: 'categories/:id', method: RequestMethod.PATCH });
  }
}
