import { Module } from '@nestjs/common';
import { ExtraItemsService } from './extra-items.service';
import { ExtraItemsController } from './extra-items.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Language } from 'src/languages/entities/language.entity';
import { ExtraItem } from './entities/extra-item.entity';
import { ExtraItemTranslation } from './entities/extra-item-translation.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Language, ExtraItem, ExtraItemTranslation]),
  ],
  controllers: [ExtraItemsController],
  providers: [ExtraItemsService],
  exports: [ExtraItemsService],
})
export class ExtraItemsModule {}
