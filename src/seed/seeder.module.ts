import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Restaurant } from '../restaurants/entities/restaurant.entity';
import { Language } from '../languages/entities/language.entity';
import { Seeder } from './seeder';
import { AppModule } from '../app.module';
import { LanguageSeeder } from './language.seeder';

@Module({
  imports: [AppModule, TypeOrmModule.forFeature([Language, Restaurant])],
  providers: [Seeder, Logger, LanguageSeeder],
})
export class SeederModule {}
