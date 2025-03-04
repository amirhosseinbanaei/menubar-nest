import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';
import { DataSource, MoreThan, Repository } from 'typeorm';
import { Item } from './entities/item.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ItemTranslation } from './entities/item-translation.entity';
import { executeTransaction } from 'src/common/utils/transaction.util';
import { plainToInstance } from 'class-transformer';
import { ItemResponseDto } from './dto/response-item.dto';
import { DeleteUploadedFile } from 'src/common/utils/function.util';
import { UpdateItemDto } from './dto/update-item.dto';

@Injectable()
export class ItemsService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
    @InjectRepository(ItemTranslation)
    private readonly itemTranslationRepository: Repository<ItemTranslation>,
  ) {}

  async create(createItemDto: CreateItemDto, imageName: string) {
    const {
      restaurant_id,
      category_id,
      subcategory_id,
      translations,
      price,
      discount,
      is_available,
      is_hide,
    } = createItemDto;

    return await executeTransaction(this.dataSource, async (manager) => {
      const duplicate = await Promise.all(
        await manager.find(ItemTranslation, {
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
          message: 'Item name already exists',
          existing_names: duplicate,
        });
      }

      const newItemOrder = await manager.count(Item);

      const item = await manager.save(Item, {
        restaurant: { id: restaurant_id },
        category: { id: category_id },
        subcategory: { id: subcategory_id },
        image: `https://localhost:4000/${imageName}`,
        order: newItemOrder + 1,
        price,
        discount,
        is_hide,
        is_available,
      });

      translations.forEach(async (itemTranslationData) => {
        const { language, name, description } = itemTranslationData;
        await manager.save(ItemTranslation, {
          name,
          description,
          item,
          language: { language_code: language },
        });
      });

      return { id: item.id, ...createItemDto };
    });
  }

  async findAll(
    language?: string,
    options?: {
      relation?: boolean;
      serialize?: boolean;
    },
  ) {
    const relations = !options.relation
      ? []
      : ['translations', 'translations.language', 'category', 'subcategory'];

    const items = await this.itemRepository.find({
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
      return plainToInstance(ItemResponseDto, items, {
        excludeExtraneousValues: true,
      });

    return items;
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
      ? ['translations', 'translations.language', 'category', 'subcategory']
      : [];

    const item = await this.itemRepository.findOne({
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

    if (!item) throw new NotFoundException(`Item with ID ${id} not found.`);

    if (options?.serialize)
      return plainToInstance(ItemResponseDto, item, {
        excludeExtraneousValues: true,
      });

    return item;
  }

  async update(
    id: number,
    updateItemDto: UpdateItemDto,
    newImageFile?: Express.Multer.File,
  ) {
    const item = (await this.findOne(id, undefined, {
      relation: true,
      serialize: false,
    })) as Item;

    const {
      translations,
      price,
      discount,
      subcategory_id,
      category_id,
      is_available,
      is_hide,
    } = updateItemDto;

    if (newImageFile) {
      const oldIMageName = item.image.split('/').pop();
      await DeleteUploadedFile('items', oldIMageName);
      item.image = `https://localhost:4000/${newImageFile.filename}`;
    }

    if (translations) {
      await Promise.all(
        translations.map(async (translation) => {
          const duplicate = await this.itemTranslationRepository.find({
            where: {
              name: translation.name,
              language: {
                language_code: translation.language,
              },
            },
          });

          if (duplicate.length) {
            throw new ConflictException({
              status: 'error',
              message: 'Item name already exists',
              existing_names: duplicate,
            });
          }

          const itemTranslation = item.translations.find(
            (t) => t.language.language_code === translation.language,
          );
          itemTranslation.name = translation.name;

          await this.itemTranslationRepository.save(itemTranslation);
        }),
      );
    }

    if (price) item.price = price;
    if (is_hide) item.is_hide = is_hide;
    if (discount) item.discount = discount;
    if (category_id) item.category.id = category_id;
    if (is_available) item.is_available = is_available;
    if (subcategory_id) item.subcategory.id = subcategory_id;

    await this.itemRepository.save(item);

    return plainToInstance(ItemResponseDto, item, {
      excludeExtraneousValues: true,
    });
  }

  async remove(id: number) {
    const item = await this.findOne(id, undefined, {
      serialize: true,
      relation: true,
    });

    if (!item) return;
    const imageName = item.image.split('/').pop();
    await DeleteUploadedFile('items', imageName);

    return await executeTransaction(this.dataSource, async (manager) => {
      const itemsWithHigherOrder = await manager.find(Item, {
        where: {
          order: MoreThan(item.order),
        },
      });

      itemsWithHigherOrder.forEach((category) => (category.order -= 1));

      await manager.save(Item, itemsWithHigherOrder);
      await manager.delete(Item, id);

      return item;
    });
  }
}
