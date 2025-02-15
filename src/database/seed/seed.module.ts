import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Language } from '../../languages/entities/language.entity';
import { Seeder } from './seed.service';
import { AppModule } from '../../app.module';

@Module({
  imports: [AppModule, TypeOrmModule.forFeature([Language])],
  providers: [Seeder, Logger],
})
export class SeederModule {}
