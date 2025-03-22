import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateExtraItemDto } from './dto/create-extra-item.dto';
import { UpdateExtraItemDto } from './dto/update-extra-item.dto';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtraItem } from './entities/extra-item.entity';
import { ExtraItemTranslation } from './entities/extra-item-translation.entity';
import { executeTransaction } from 'src/common/utils/transaction.util';
import { plainToInstance } from 'class-transformer';
import { ExtraItemResponseDto } from './dto/response-extra-item.dto';
import { DeleteUploadedFile } from 'src/common/utils/function.util';

@Injectable()
export class ExtraItemsService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(ExtraItem)
    private readonly extraItemRepository: Repository<ExtraItem>,
    @InjectRepository(ExtraItemTranslation)
    private readonly extraItemTranslationRepository: Repository<ExtraItemTranslation>,
  ) {}

  async create(createExtraItemDto: CreateExtraItemDto, imageName: string) {
    const { restaurant_id, branch_id, price, is_hidden, translations } =
      createExtraItemDto;

    return await executeTransaction(this.dataSource, async (manager) => {
      const duplicate = await Promise.all(
        await manager.find(ExtraItemTranslation, {
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
          message: 'Extra item name already exists',
          existing_names: duplicate,
        });
      }

      const extraItem = await manager.save(ExtraItem, {
        restaurant: { id: restaurant_id },
        branch: { id: branch_id },
        price,
        is_hidden,
        image: imageName
          ? `${process.env.FILE_URL}/extra-items/${imageName}`
          : `${process.env.FILE_URL}/defaults/category.png`,
      });

      translations.forEach(async (extraItemTranslationData) => {
        const { language, name } = extraItemTranslationData;
        await manager.save(ExtraItemTranslation, {
          name,
          extraItem,
          language: { language_code: language },
        });
      });

      return { id: extraItem.id, ...createExtraItemDto };
    });
  }

  async findAll(
    language?: string,
    options?: {
      relation?: boolean;
      serialize?: boolean;
    },
  ) {
    const relations = options?.relation
      ? ['translations', 'translations.language']
      : [];

    const extraItems = await this.extraItemRepository.find({
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
      return plainToInstance(ExtraItemResponseDto, extraItems, {
        excludeExtraneousValues: true,
      });

    return extraItems;
  }

  async findOne(
    id: number,
    language?: string,
    options?: {
      relation?: boolean;
      serialize?: boolean;
    },
  ) {
    const relations = options?.relation
      ? ['translations', 'translations.language']
      : [];

    const extraItem = await this.extraItemRepository.findOne({
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

    if (!extraItem)
      throw new NotFoundException(`Extra item with ID ${id} not found.`);

    if (options?.serialize)
      return plainToInstance(ExtraItemResponseDto, extraItem, {
        excludeExtraneousValues: true,
      });

    return extraItem;
  }

  async update(
    id: number,
    updateExtraItemDto: UpdateExtraItemDto,
    newImageFile?: Express.Multer.File,
  ) {
    const extraItem = (await this.findOne(id, undefined, {
      relation: true,
    })) as ExtraItem;

    const { translations, price, is_hidden } = updateExtraItemDto;

    if (newImageFile) {
      if (!extraItem.image.includes('defaults')) {
        const oldIMageName = extraItem.image.split('/').pop();
        await DeleteUploadedFile('extra-items', oldIMageName);
      }
      extraItem.image = `${process.env.FILE_URL}/extra-items/${newImageFile.filename}`;
    }

    if (price !== undefined) extraItem.price = price;
    if (is_hidden !== undefined) extraItem.is_hidden = is_hidden;

    if (translations) {
      await Promise.all(
        translations.map(async (translation) => {
          if (translation.name) {
            const duplicate = await this.extraItemTranslationRepository.find({
              where: {
                name: translation.name,
                language: { language_code: translation.language },
              },
            });

            if (duplicate.length) {
              throw new ConflictException({
                status: 'error',
                message: 'Extra item name already exists',
                existing_names: duplicate,
              });
            }
          }

          const extraItemTranslation = extraItem.translations.find(
            (t) => t.language.language_code === translation.language,
          );

          if (translation.name) extraItemTranslation.name = translation.name;

          await this.extraItemTranslationRepository.save(extraItemTranslation);
        }),
      );
    }

    await this.extraItemRepository.save(extraItem);
    return plainToInstance(ExtraItemResponseDto, extraItem, {
      excludeExtraneousValues: true,
    });
  }

  async remove(id: number) {
    const extraItem = await this.findOne(id, undefined, {
      serialize: true,
      relation: true,
    });

    if (!extraItem) return;

    if (!extraItem.image.includes('defaults')) {
      const imageName = extraItem.image.split('/').pop();
      await DeleteUploadedFile('extra-items', imageName);
    }

    await this.extraItemRepository.delete(id);
    return extraItem;
  }
}
