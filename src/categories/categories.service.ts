import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { CategoryTranslation } from './entities/category-translation.entity';
import { DataSource, MoreThan, Repository } from 'typeorm';
import { DeleteUploadedFile } from '../common/utils/function.util';
import {
  UpdateCategoryDto,
  UpdateCategoryOrdersDto,
} from './dto/update-category.dto';
import { categoryRelationsHandler } from './utils/categories.util';
import { CategoryRelations } from './types/relations-category.type';
import { plainToInstance } from 'class-transformer';
import { CategoryResponseDto } from './dto/response-category.dto';
import { executeTransaction } from 'src/common/utils/transaction.util';

@Injectable()
export class CategoriesService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(CategoryTranslation)
    private readonly categoryTranslationRepository: Repository<CategoryTranslation>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto, imageName: string) {
    const { restaurant_id, translations } = createCategoryDto;

    return await executeTransaction(this.dataSource, async (manager) => {
      const duplicate = await Promise.all(
        await manager.find(CategoryTranslation, {
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
          message: 'Category name already exists',
          existing_names: duplicate,
        });
      }

      const newCategoryOrder = await manager.count(Category);

      const category = await manager.save(Category, {
        restaurant: { id: restaurant_id },
        image: `https://localhost:4000/${imageName}`,
        order: newCategoryOrder + 1,
      });

      translations.forEach(async (categoryTranslationData) => {
        const { language, name } = categoryTranslationData;
        await manager.save(CategoryTranslation, {
          name,
          category,
          language: { language_code: language },
        });
      });

      return { id: category.id, ...createCategoryDto };
    });
  }

  async findOne(
    id: number,
    language?: string,
    options?: {
      relations?: CategoryRelations;
      serialize?: boolean;
    },
  ) {
    const queryRelations = categoryRelationsHandler(options?.relations);

    const category = await this.categoryRepository.findOne({
      where: {
        id,
        translations: {
          language: {
            language_code: language,
          },
        },
        subcategories: {
          translations: {
            language: {
              language_code: language,
            },
          },
        },
      },
      relations: queryRelations,
    });

    if (!category)
      throw new NotFoundException(`Category with ID ${id} not found.`);

    if (options?.serialize)
      return plainToInstance(CategoryResponseDto, category, {
        excludeExtraneousValues: true,
      });

    return category;
  }

  async findAll(
    language?: string,
    options?: {
      relations?: CategoryRelations;
      serialize?: boolean;
    },
  ) {
    const queryRelations = categoryRelationsHandler(options?.relations);

    const categories = await this.categoryRepository.find({
      where: {
        translations: {
          language: {
            language_code: language,
          },
        },
        subcategories: {
          translations: {
            language: {
              language_code: language,
            },
          },
        },
      },
      relations: queryRelations,
    });

    if (options?.serialize)
      return plainToInstance(CategoryResponseDto, categories, {
        excludeExtraneousValues: true,
      });

    return categories;
  }

  async findAllTranslation(lang: string, name?: string) {
    const categoryTranslation = await this.categoryTranslationRepository.find({
      where: { name, language: { language_code: lang } },
    });

    if (!categoryTranslation) {
      throw new NotFoundException(
        `Category Translation with name ${name} and language ${lang} not found.`,
      );
    }
    return categoryTranslation;
  }

  async update(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
    newImageFile?: Express.Multer.File,
  ) {
    const category = (await this.findOne(id, undefined, {
      relations: 'all',
    })) as Category;

    const { translations } = updateCategoryDto;

    if (newImageFile) {
      const oldIMageName = category.image.split('/').pop();
      console.log(oldIMageName);
      await DeleteUploadedFile('categories', oldIMageName);
      category.image = `https://localhost:4000/${newImageFile.filename}`;
    }

    if (translations) {
      await Promise.all(
        translations.map(async (translation) => {
          const duplicate = await this.categoryTranslationRepository.find({
            where: {
              name: translation.name,
              language: { language_code: translation.language },
            },
          });

          if (duplicate.length) {
            throw new ConflictException({
              status: 'error',
              message: 'Category name already exists',
              existing_names: duplicate,
            });
          }

          const categoryTranslation = category.translations.find(
            (t) => t.language.language_code === translation.language,
          );
          categoryTranslation.name = translation.name;
        }),
      );
    }

    await this.categoryRepository.save(category);
    return plainToInstance(CategoryResponseDto, category, {
      excludeExtraneousValues: true,
    });
  }

  async updateOrders(updateCategoryOrdersDto: UpdateCategoryOrdersDto) {
    const { orders } = updateCategoryOrdersDto;

    const categories = (await this.findAll(undefined, {
      serialize: false,
    })) as Category[];

    for (let i = 0; i < categories.length; i++) {
      if (categories[i].id === orders[i].id)
        categories[i].order = orders[i].order;
    }

    return await this.categoryRepository.save(categories);
  }

  async remove(id: number) {
    const category = await this.findOne(id, undefined, {
      serialize: true,
      relations: 'all',
    });

    if (!category) return;
    const imageName = category.image.split('/').pop();
    await DeleteUploadedFile('categories', imageName);

    return await executeTransaction(this.dataSource, async (manager) => {
      const categoriesWithHigherOrder = await manager.find(Category, {
        where: {
          order: MoreThan(category.order),
        },
      });

      categoriesWithHigherOrder.forEach((category) => (category.order -= 1));

      await manager.save(Category, categoriesWithHigherOrder);
      await manager.delete(Category, id);

      return category;
    });
  }
}
