import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { Category } from './entities/category.entity';
import { Language } from '../languages/entities/language.entity';
import { CategoryTranslation } from './entities/category-translation.entity';
import { Subcategory } from './entities/subcategory.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Language,
      Category,
      CategoryTranslation,
      Subcategory,
    ]),
  ],
  controllers: [CategoriesController],
  providers: [CategoriesService],
})
export class CategoriesModule {}
