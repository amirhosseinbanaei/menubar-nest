import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { SubcategoriesService } from './subcategories.service';
import { SubcategoriesController } from './subcategories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subcategory } from './entities/subcategory.entity';
import { SubcategoryTranslation } from './entities/subcategory-translation.entity';
import { Language } from '../languages/entities/language.entity';
import { CategoriesModule } from 'src/categories/categories.module';
import { CheckQueryLanguageMiddleware } from 'src/common/middlewares/language.middleware';

@Module({
  imports: [
    TypeOrmModule.forFeature([Language, Subcategory, SubcategoryTranslation]),
    CategoriesModule,
  ],
  controllers: [SubcategoriesController],
  providers: [SubcategoriesService],
})
export class SubcategoriesModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CheckQueryLanguageMiddleware)
      .forRoutes({
        path: 'subcategories',
        method: RequestMethod.GET,
      })
      .apply(CheckQueryLanguageMiddleware)
      .forRoutes({
        path: 'subcategories/:id',
        method: RequestMethod.GET,
      });
  }
}
