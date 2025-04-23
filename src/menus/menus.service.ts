import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { CategoriesService } from 'src/categories/categories.service';
import { Category } from 'src/categories/entities/category.entity';
import { Item } from 'src/items/entities/item.entity';
import { ItemsService } from 'src/items/items.service';
import { Repository } from 'typeorm';
import { MenuResponseDto } from './dto/respone-menu.dto';

@Injectable()
export class MenusService {
  constructor(
    private readonly categoriesService: CategoriesService,
    private readonly itemsService: ItemsService,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
  ) {}
  async findAllMain(language?: string) {
    const menuData = await this.categoryRepository.find({
      where: {
        translations: {
          language: {
            language_code: language,
          },
        },
        restaurant: {
          id: 1,
        },
      },
      relations: {
        translations: {
          language: true,
        },
        subcategories: {
          translations: {
            language: true,
          },
          items: {
            translations: true,
            tags: {
              translations: true,
            },
            extraItems: {
              translations: true,
            },
          },
        },
      },
    });
    // console.log(menuData);
    return menuData;
  }

  async findAll(restaurant_id: number, language?: string) {
    const categories = await this.categoriesService.findAll(language, {
      serialize: true,
      relation: true,
      extraWhereOption: {
        restaurant: { id: restaurant_id },
      },
    });

    // const items = await this.itemsService.findAll(language, {
    //   relation: true,
    //   serialize: true,
    //   extraWhereOption: {
    //     category: { id: categories[0].id },
    //     restaurant: { id: restaurant_id },
    //     tags: {
    //       translations: {
    //         language: {
    //           language_code: language,
    //         },
    //       },
    //     },
    //     extraItems: {
    //       translations: {
    //         language: {
    //           language_code: language,
    //         },
    //       },
    //     },
    //   },
    //   extraRelation: [
    //     'tags',
    //     'tags.translations',
    //     'extraItems',
    //     'extraItems.translations',
    //   ],
    // });

    const items = await this.itemRepository.find({
      where: {
        restaurant: { id: restaurant_id },
      },
      relations: {
        translations: true,
        tags: {
          translations: true,
        },
        extraItems: {
          translations: true,
        },
      },
    });
    return { categories, items };
  }

  async getFullMenu(restaurantId: number, language?: string) {
    // Get categories with all translations
    // console.log(restaurantId, language);
    // const categories = await this.categoriesService.findAll(language, {
    //   serialize: false,
    //   relation: true,
    //   extraWhereOption: {
    //     restaurant: { id: restaurantId },
    //   },
    //   extraRelation: ['subcategories', 'subcategories.translations'],
    // });
    const categories = await this.categoryRepository.find({
      where: {
        restaurant: { id: restaurantId },
      },
      relations: {
        translations: {
          language: true,
        },
        subcategories: {
          translations: {
            language: true,
          },
        },
      },
    });

    // Get all items with all translations
    const items = await this.itemRepository.find({
      where: {
        restaurant: { id: restaurantId },
      },
      relations: {
        translations: {
          language: true,
        },
        tags: {
          translations: {
            language: true,
          },
        },
        extraItems: {
          translations: {
            language: true,
          },
        },
        subcategory: true,
      },
    });

    // const items = await this.itemsService.findAll(language, {
    //   serialize: true,
    //   relation: true,
    //   extraWhereOption: {
    //     restaurant: { id: restaurantId },
    //   },
    //   extraRelation: [
    //     'tags',
    //     'tags.translations',
    //     'extraItems',
    //     'extraItems.translations',
    //   ],
    // });

    // Helper function to get translation in requested language or fallback to first available
    const getTranslation = (translations: any[]) => {
      if (!translations || translations.length === 0) return null;

      const requestedTranslation = translations.find(
        (t) => t.language.language_code === language,
      );

      // Return requested language or fallback to first translation
      return requestedTranslation || translations[0];
    };

    // Process entity with translations
    const processEntity = (entity) => {
      if (!entity) return null;

      const translation = getTranslation(entity.translations);

      console.log(entity);

      return {
        id: entity?.id,
        name: translation?.name,
        description: translation?.description,
        // ... other fields you want to include
        // Keep original data that's not translation-dependent
        price: entity?.price,
        image: entity?.image,
        tags: entity?.tags,
        extraItems: entity?.extraItems,
        subcategory: entity?.subcategory,
        // etc...
      };
    };

    // Process items with their relations
    const processedItems = items.map((item) => {
      const processedItem = processEntity(item);

      // Process tags
      if (item.tags) {
        processedItem.tags = item.tags.map((tag) => processEntity(tag));
      }

      // Process extra items
      if (item.extraItems) {
        processedItem.extraItems = item.extraItems.map((extraItem) => {
          return processEntity(extraItem);
        });
      }

      return processedItem;
    });

    // Group items by subcategory
    const itemsBySubcategory = processedItems.reduce((acc, item) => {
      const subcategoryId = item.subcategory?.id;
      if (!acc[subcategoryId]) {
        acc[subcategoryId] = [];
      }
      acc[subcategoryId].push(item);
      return acc;
    }, {});

    // Process categories and combine all data
    const fullMenu = categories.map((category) => {
      const processedCategory = processEntity(category);
      return {
        ...processedCategory,
        subcategories: category.subcategories.map((subcategory) => ({
          ...processEntity(subcategory),
          items: itemsBySubcategory[subcategory.id] || [],
        })),
      };
    });

    return fullMenu;
  }

  async findOne(category_id: number) {
    const category = await this.categoriesService.findOne(category_id);
    if (!category) return null;
    const items = await this.itemsService.findAll(undefined, {
      relation: true,
      serialize: true,
      extraWhereOption: {
        category: { id: category_id },
      },
      extraRelation: ['tags', 'tags.translations'],
    });
    return { items };
  }

  async test(restaurant_id: number, language?: string) {
    const test = await this.categoryRepository.find({
      where: {
        restaurant: { id: restaurant_id },
        translations: {
          language: { language_code: language },
        },
        subcategories: {
          translations: {
            language: { language_code: language },
          },
          items: {
            translations: {
              language: { language_code: language },
            },
            tags: {
              translations: {
                language: { language_code: language },
              },
            },
            extraItems: {
              translations: {
                language: { language_code: language },
              },
            },
          },
        },
      },
      relations: {
        translations: {
          language: true,
        },
        subcategories: {
          translations: {
            language: true,
          },
          items: {
            translations: {
              language: true,
            },
            tags: {
              translations: {
                language: true,
              },
            },
            extraItems: {
              translations: {
                language: true,
              },
            },
          },
        },
      },
    });
    // const test = await this.categoryRepository.find({
    //   where: {
    //     restaurant: { id: restaurant_id },
    //     translations: {
    //       language: { language_code: language },
    //     },
    //     subcategories: {
    //       translations: {
    //         language: { language_code: language },
    //       },
    //       items: {
    //         translations: {
    //           language: { language_code: language },
    //         },
    //         tags: {
    //           translations: {
    //             language: { language_code: language },
    //           },
    //         },
    //         extraItems: {
    //           translations: {
    //             language: { language_code: language },
    //           },
    //         },
    //       },
    //     },
    //   },
    //   relations: {
    //     translations: {
    //       language: true,
    //     },
    //     subcategories: {
    //       translations: {
    //         language: true,
    //       },
    //       items: {
    //         translations: {
    //           language: true,
    //         },
    //         tags: {
    //           translations: {
    //             language: true,
    //           },
    //         },
    //         extraItems: {
    //           translations: {
    //             language: true,
    //           },
    //         },
    //       },
    //     },
    //   },
    // });
    // const test = await this.categoryRepository
    //   .createQueryBuilder('category')
    //   .leftJoinAndSelect(
    //     'category.translations',
    //     'category_translation',
    //     'category_translation.language.language_code = :lang',
    //     { lang: language },
    //   )
    //   .leftJoinAndSelect('category_translation.language', 'category_language')
    //   .leftJoinAndSelect('category.subcategories', 'subcategory')
    //   .leftJoinAndSelect(
    //     'subcategory.translations',
    //     'subcategory_translation',
    //     'subcategory_translation.language.language_code = :lang',
    //     { lang: language },
    //   )
    //   .leftJoinAndSelect(
    //     'subcategory_translation.language',
    //     'subcategory_language',
    //   )
    //   .leftJoinAndSelect('subcategory.items', 'item')
    //   .leftJoinAndSelect(
    //     'item.translations',
    //     'item_translation',
    //     'item_translation.language.language_code = :lang',
    //     { lang: language },
    //   )
    //   .leftJoinAndSelect('item_translation.language', 'item_language')
    //   .leftJoinAndSelect('item.tags', 'tag')
    //   .leftJoinAndSelect(
    //     'tag.translations',
    //     'tag_translation',
    //     'tag_translation.language.language_code = :lang',
    //     { lang: language },
    //   )
    //   .leftJoinAndSelect('tag_translation.language', 'tag_language')
    //   .leftJoinAndSelect('item.extraItems', 'extraItem')
    //   .leftJoinAndSelect(
    //     'extraItem.translations',
    //     'extraItem_translation',
    //     'extraItem_translation.language.language_code = :lang',
    //     { lang: language },
    //   )
    //   .leftJoinAndSelect('extraItem_translation.language', 'extraItem_language')

    // .where('category.restaurant_id = :restaurantId', {
    //   restaurantId: restaurant_id,
    // })

    // .getMany();

    return plainToInstance(MenuResponseDto, test, {
      excludeExtraneousValues: true,
    });
    // return test;
  }
}
