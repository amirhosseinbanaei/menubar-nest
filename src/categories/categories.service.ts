import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { CategoryTranslation } from './entities/category-translation.entity';
import { DataSource, FindOptionsWhere, MoreThan, Repository } from 'typeorm';
import { DeleteUploadedFile } from '../common/utils/function.util';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { plainToInstance } from 'class-transformer';
import { CategoryResponseDto } from './dto/response-category.dto';
import { executeTransaction } from 'src/common/utils/transaction.util';
import { Subcategory } from 'src/subcategories/entities/subcategory.entity';
import { SubcategoryTranslation } from 'src/subcategories/entities/subcategory-translation.entity';

@Injectable()
export class CategoriesService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(CategoryTranslation)
    private readonly categoryTranslationRepository: Repository<CategoryTranslation>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto, imageName?: string) {
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
        image: imageName
          ? `${process.env.FILE_URL}/categories/${imageName}`
          : `${process.env.FILE_URL}/defaults/category.png`,
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

      if (createCategoryDto.subcategories.length) {
        await Promise.all(
          createCategoryDto.subcategories.map(
            async (subcategoryData, index) => {
              const { translations } = subcategoryData;

              const subcategory = await manager.save(Subcategory, {
                restaurant: { id: restaurant_id },
                order: index + category.id + 1,
                category: { id: category.id },
              });

              await Promise.all(
                translations.map(async (subcategoryTranslationData) => {
                  const { language, name } = subcategoryTranslationData;
                  await manager.save(SubcategoryTranslation, {
                    name,
                    subcategory,
                    language: { language_code: language },
                  });
                }),
              );

              return subcategory;
            },
          ),
        );
      }
      return { id: category.id, ...createCategoryDto };
    });
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
      ? [
          'translations',
          'translations.language',
          'subcategories',
          'subcategories.translations',
        ]
      : [];

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
      relations,
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
      relation?: boolean;
      serialize?: boolean;
      details?: boolean;
      extraWhereOption?: FindOptionsWhere<Category>;
      extraRelation?: string[];
    },
  ) {
    const relations = options?.relation
      ? ['translations', 'translations.language']
      : [];

    if (options?.details)
      relations.push(...['subcategories', 'subcategories.translations']);

    if (options?.extraRelation) relations.push(...options.extraRelation);

    const categories = await this.categoryRepository.find({
      where: {
        translations: {
          language: {
            language_code: language,
          },
        },
        ...options?.extraWhereOption,
      },
      relations,
    });

    if (options?.serialize)
      return plainToInstance(CategoryResponseDto, categories, {
        excludeExtraneousValues: true,
      });

    return categories;
  }

  async update(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
    newImageFile?: Express.Multer.File,
  ) {
    const category = (await this.findOne(id, undefined, {
      relation: true,
    })) as Category;

    const { translations } = updateCategoryDto;

    if (newImageFile) {
      if (!category.image.includes('defaults')) {
        const oldIMageName = category.image.split('/').pop();
        await DeleteUploadedFile('categories', oldIMageName);
      }
      category.image = `${process.env.FILE_URL}/categories/${newImageFile.filename}`;
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

  async remove(id: number) {
    const category = await this.findOne(id, undefined, {
      serialize: true,
      relation: true,
    });

    if (!category) return;

    if (!category.image.includes('defaults')) {
      const imageName = category.image.split('/').pop();
      await DeleteUploadedFile('categories', imageName);
    }

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
