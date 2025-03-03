import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateSubcategoryDto } from './dto/create-subcategory.dto';
import { CategoriesService } from '../categories/categories.service';
import { DataSource, MoreThan, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Subcategory } from './entities/subcategory.entity';
import { executeTransaction } from '../common/utils/transaction.util';
import { SubcategoryTranslation } from './entities/subcategory-translation.entity';
import { plainToInstance } from 'class-transformer';
import { SubCategoryResponseDto } from './dto/response-subcategory.dto';
import {
  UpdateSubcategoryDto,
  UpdateSubcategoryOrdersDto,
} from './dto/update-subcategory.dto';

@Injectable()
export class SubcategoriesService {
  constructor(
    private dataSource: DataSource,
    private readonly categoryService: CategoriesService,
    @InjectRepository(Subcategory)
    private readonly subcategoryRepository: Repository<Subcategory>,
  ) {}

  async create(createSubcategoryDto: CreateSubcategoryDto) {
    const { category_id, translations } = createSubcategoryDto;

    const category = await this.categoryService.findOne(category_id);

    if (!category) return;

    return await executeTransaction(this.dataSource, async (manager) => {
      const newSubcategoryOrder = await manager.countBy(Subcategory, {
        category: { id: category_id },
      });

      const savedSubcategory = await manager.save(Subcategory, {
        category: { id: category_id },
        order: newSubcategoryOrder + 1,
      });

      const duplicate = await Promise.all(
        await manager
          .find(SubcategoryTranslation, {
            where: translations.map((translation) => {
              return {
                name: translation.name,
                language: { language_code: translation.language },
              };
            }),
          })
          .then((result) => {
            return result.map((translation) => translation.name);
          }),
      );

      if (duplicate.length) {
        throw new ConflictException({
          status: 'error',
          message: 'Subcategory name already exists',
          existing_names: duplicate,
        });
      }

      translations.forEach(async (translation) => {
        return await manager.save(SubcategoryTranslation, {
          name: translation.name,
          language: { language_code: translation.language },
          subcategory: savedSubcategory,
        });
      });

      return { id: savedSubcategory.id, translations };
    });
  }

  async findOne(
    id: number,
    language?: string,
    options?: {
      serialize?: boolean;
    },
  ) {
    const subcategory = await this.subcategoryRepository.findOne({
      where: {
        id,
        translations: {
          language: {
            language_code: language,
          },
        },
      },
    });

    if (!subcategory)
      throw new NotFoundException(`Subcategory with ID ${id} not found.`);

    if (options?.serialize)
      return plainToInstance(SubCategoryResponseDto, subcategory, {
        excludeExtraneousValues: true,
      });

    return subcategory;
  }

  async findAll(
    language?: string,
    options?: {
      serialize?: boolean;
    },
  ) {
    const subcategory = await this.subcategoryRepository.find({
      where: {
        translations: {
          language: {
            language_code: language,
          },
        },
      },
      relations: ['translations', 'translations.language'],
    });

    if (options?.serialize)
      return plainToInstance(SubCategoryResponseDto, subcategory, {
        excludeExtraneousValues: true,
      });

    return subcategory;
  }

  async update(id: number, updateSubcategoryDto: UpdateSubcategoryDto) {
    const { translations } = updateSubcategoryDto;

    return await executeTransaction(this.dataSource, async (manager) => {
      const subcategory = await manager.findOne(Subcategory, { where: { id } });

      if (!subcategory)
        throw new NotFoundException(`Subcategory with ID ${id} not found.`);

      const duplicateTranslations = await Promise.all(
        await manager
          .find(SubcategoryTranslation, {
            where: translations.map((translation) => {
              return {
                name: translation.name,
              };
            }),
          })
          .then((result) => {
            return result.map((translation) => translation.name);
          }),
      );

      if (duplicateTranslations.length) {
        throw new ConflictException({
          status: 'error',
          message: 'Subcategory name already exists',
          existing_names: duplicateTranslations,
        });
      }

      translations.forEach(async (translation) => {
        await manager.update(
          SubcategoryTranslation,
          {
            subcategory: { id },
            language: { language_code: translation.language },
          },
          {
            name: translation.name,
          },
        );
      });

      return { ...subcategory, ...updateSubcategoryDto };
    });
  }

  async updateOrders(updateSubcategoryOrdersDto: UpdateSubcategoryOrdersDto) {
    const { category_id, orders } = updateSubcategoryOrdersDto;

    const subcategories = await this.subcategoryRepository.find({
      where: {
        category: {
          id: category_id,
        },
      },
      select: {
        id: true,
        order: true,
      },
    });

    if (!subcategories.length)
      throw new NotFoundException(`Invalid Category ID : ${category_id}`);

    for (let i = 0; i < subcategories.length; i++) {
      if (subcategories[i].id === orders[i].id)
        subcategories[i].order = orders[i].order;
    }

    return await this.subcategoryRepository.save(subcategories);
  }

  async remove(id: number) {
    const subcategory = await this.findOne(id, undefined, {
      serialize: true,
    });

    if (!subcategory) return;

    return await executeTransaction(this.dataSource, async (manager) => {
      const subcategoriesWithHigherOrder = await manager.find(Subcategory, {
        where: {
          order: MoreThan(subcategory.order),
        },
      });

      subcategoriesWithHigherOrder.forEach(
        (subcategory) => (subcategory.order -= 1),
      );

      await manager.save(Subcategory, subcategoriesWithHigherOrder);
      await manager.delete(Subcategory, id);

      return subcategory;
    });
  }
}
