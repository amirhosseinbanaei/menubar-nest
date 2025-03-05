import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Language } from '../../languages/entities/language.entity';
import { Seeder } from './seed.service';
import { AppModule } from '../../app.module';
// import { Category } from '../../categories/entities/category.entity';
// import { CategoryTranslation } from '../../categories/entities/category-translation.entity';

@Module({
  imports: [AppModule, TypeOrmModule.forFeature([Language])],
  providers: [Seeder, Logger],
})
export class SeederModule {}
