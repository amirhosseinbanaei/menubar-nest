import { Injectable } from '@nestjs/common';
import { CategoriesService } from 'src/categories/categories.service';
import { ItemsService } from 'src/items/items.service';

@Injectable()
export class MenusService {
  constructor(
    private readonly categoriesService: CategoriesService,
    private readonly itemsService: ItemsService,
  ) {}
  async findAll() {
    const categories = await this.categoriesService.findAll(undefined, {
      serialize: true,
    });
    const items = await this.itemsService.findAll(undefined, {
      relation: true,
      serialize: true,
      extraWhereOption: {
        category: { id: categories[0].id },
      },
    });
    return { categories, items };
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
    });
    return { items };
  }
}
