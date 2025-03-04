import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ListingOrderDto } from './listing-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from 'src/categories/entities/category.entity';
import { Subcategory } from 'src/subcategories/entities/subcategory.entity';
import { Item } from 'src/items/entities/item.entity';

@Injectable()
export class ListingOrdersService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Subcategory)
    private readonly subCategoryRepository: Repository<Subcategory>,
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
  ) {}

  async updateOrders(entity: string, listingOrderDto: ListingOrderDto) {
    const { orders } = listingOrderDto;

    const foundedItems = await (async () => {
      switch (entity) {
        case 'categories':
          return await this.categoryRepository.find();
        case 'subcategories':
          if (!listingOrderDto.category_id)
            throw new BadRequestException(
              'Category Id is required for reorder subcategories',
            );

          const isExistCategory = await this.categoryRepository.findOne({
            where: {
              id: listingOrderDto.category_id,
            },
          });

          if (!isExistCategory)
            throw new NotFoundException(
              `Category with ID ${listingOrderDto.category_id} not found.`,
            );

          return await this.subCategoryRepository.find();
        case 'items':
          return await this.itemRepository.find();
        default:
          throw new BadRequestException(`Invalid entity: ${entity}`);
      }
    })();

    if (foundedItems.length !== orders.length)
      throw new BadRequestException(
        'Existing entities length are not equal sent orders length !',
      );

    for (let i = 0; i < foundedItems.length; i++) {
      if (foundedItems[i].id === orders[i].id)
        foundedItems[i].order = orders[i].order;
    }

    switch (entity) {
      case 'categories':
        await this.categoryRepository.save(orders);
        return 'category listing orders updated successfully';
      case 'subcategories':
        await this.subCategoryRepository.save(orders);
        return 'subcategories listing orders updated successfully';
      case 'items':
        return await this.itemRepository.save(orders);
      default:
        throw new BadRequestException(`Can't update listing orders`);
    }
  }
}
