import { Module } from '@nestjs/common';
import { ExtraItemsService } from './extra-items.service';
import { ExtraItemsController } from './extra-items.controller';

@Module({
  controllers: [ExtraItemsController],
  providers: [ExtraItemsService],
})
export class ExtraItemsModule {}
