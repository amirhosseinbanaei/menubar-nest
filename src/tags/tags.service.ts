import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from './entities/tag.entity';
import { TagTranslation } from './entities/tag-translation.entity';
import { executeTransaction } from 'src/common/utils/transaction.util';
import { plainToInstance } from 'class-transformer';
import { TagResponseDto } from './dto/response-tag.dto';
import { DeleteUploadedFile } from 'src/common/utils/function.util';

@Injectable()
export class TagsService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
    @InjectRepository(TagTranslation)
    private readonly tagTranslationRepository: Repository<TagTranslation>,
  ) {}

  async create(createTagDto: CreateTagDto, imageName: string) {
    const { restaurant_id, translations } = createTagDto;

    return await executeTransaction(this.dataSource, async (manager) => {
      const duplicate = await Promise.all(
        await manager.find(TagTranslation, {
          where: translations.map((translation) => {
            return {
              name: translation.name,
              language: { language_code: translation.language },
            };
          }),
        }),
      ).then((result) => {
        return result.map((translation) => translation.name);
      });

      if (duplicate.length) {
        throw new ConflictException({
          status: 'error',
          message: 'Tag name already exists',
          existing_names: duplicate,
        });
      }

      const tag = await manager.save(Tag, {
        restaurant: { id: restaurant_id },
        image: `https://localhost:4000/${imageName}`,
      });

      translations.forEach(async (tagTranslationData) => {
        const { language, name, description } = tagTranslationData;
        await manager.save(TagTranslation, {
          name,
          tag,
          description,
          language: { language_code: language },
        });
      });

      return { id: tag.id, ...createTagDto };
    });
  }

  async findAll(
    language?: string,
    options?: {
      relation?: boolean;
      serialize?: boolean;
    },
  ) {
    const relations = options.relation
      ? ['translations', 'translations.language']
      : [];

    const tags = await this.tagRepository.find({
      where: {
        translations: {
          language: {
            language_code: language,
          },
        },
      },
      relations,
    });

    if (options?.serialize)
      return plainToInstance(TagResponseDto, tags, {
        excludeExtraneousValues: true,
      });

    return tags;
  }

  async findOne(
    id: number,
    language?: string,
    options?: {
      relation?: boolean;
      serialize?: boolean;
    },
  ) {
    const relations = options.relation
      ? ['translations', 'translations.language']
      : [];

    const tag = await this.tagRepository.findOne({
      where: {
        id,
        translations: {
          language: {
            language_code: language,
          },
        },
      },
      relations,
    });

    if (!tag) throw new NotFoundException(`Tag with ID ${id} not found.`);

    if (options?.serialize)
      return plainToInstance(TagResponseDto, tag, {
        excludeExtraneousValues: true,
      }) as TagResponseDto;

    return tag as Tag;
  }

  async update(
    id: number,
    updateTagDto: UpdateTagDto,
    newImageFile?: Express.Multer.File,
  ) {
    const category = (await this.findOne(id, undefined, {
      relation: true,
    })) as Tag;

    const { translations } = updateTagDto;

    if (newImageFile) {
      const oldIMageName = category.image.split('/').pop();
      await DeleteUploadedFile('tags', oldIMageName);
      category.image = `https://localhost:4000/${newImageFile.filename}`;
    }

    if (translations) {
      await Promise.all(
        translations.map(async (translation) => {
          if (translation.name) {
            const duplicate = await this.tagTranslationRepository.find({
              where: {
                name: translation?.name || null,
                language: { language_code: translation.language },
              },
            });

            if (duplicate.length) {
              throw new ConflictException({
                status: 'error',
                message: 'Tag name already exists',
                existing_names: duplicate,
              });
            }
          }

          const tagTranslation = category.translations.find(
            (t) => t.language.language_code === translation.language,
          );

          if (translation.name) tagTranslation.name = translation.name;
          if (translation.description)
            tagTranslation.description = translation.description;

          await this.tagTranslationRepository.save(tagTranslation);
        }),
      );
    }

    await this.tagRepository.save(category);
    return plainToInstance(TagResponseDto, category, {
      excludeExtraneousValues: true,
    });
  }

  async remove(id: number) {
    const tag = await this.findOne(id, undefined, {
      serialize: true,
      relation: true,
    });

    if (!tag) return;
    const imageName = tag.image.split('/').pop();
    await DeleteUploadedFile('tags', imageName);
    await this.tagRepository.delete(id);
    return tag;
  }
}
