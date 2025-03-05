import { Module } from '@nestjs/common';
import { TagsService } from './tags.service';
import { TagsController } from './tags.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Language } from 'src/languages/entities/language.entity';
import { Tag } from './entities/tag.entity';
import { TagTranslation } from './entities/tag-translation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Language, Tag, TagTranslation])],
  controllers: [TagsController],
  providers: [TagsService],
  exports: [TagsService],
})
export class TagsModule {}
