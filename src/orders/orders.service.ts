import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  Between,
  Like,
  MoreThanOrEqual,
  LessThanOrEqual,
} from 'typeorm';
import { Order, OrderStatus } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { plainToInstance } from 'class-transformer';
import { OrderResponseDto } from './dto/response-order.dto';
import { UsersService } from 'src/users/users.service';
import { RestaurantsService } from 'src/restaurants/restaurants.service';
import { ItemsService } from 'src/items/items.service';
import { ExtraItemsService } from 'src/extra-items/extra-items.service';
import { Restaurant } from 'src/restaurants/entities/restaurant.entity';
import { PaginationDto } from './dto/pagination.dto';
import { PaginatedResponseDto } from '../common/dto/pagination-response.dto';
import { FilterOrderDto } from './dto/filter-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    private readonly userService: UsersService,
    private readonly restaurantService: RestaurantsService,
    private readonly itemService: ItemsService,
    private readonly extraItemService: ExtraItemsService,
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    const {
      user_id,
      restaurant_id,
      items,
      payment_type,
      scheduled_pickup_time,
      table_number,
    } = createOrderDto;

    const user = await this.userService.findOne(user_id);
    const restaurant = (await this.restaurantService.findOne(restaurant_id, {
      serialize: false,
    })) as Restaurant;

    if (!user) {
      throw new NotFoundException(`User with ID ${user_id} not found`);
    }

    if (!restaurant) {
      throw new NotFoundException(
        `Restaurant with ID ${restaurant_id} not found`,
      );
    }

    await Promise.all(
      items.map(async (item) => {
        const itemData = await this.itemService.findOne(item.id, undefined, {
          serialize: false,
          relation: false,
        });

        if (!itemData)
          throw new NotFoundException(`Item with ID ${item.id} not found`);

        if (item.extra_items) {
          await Promise.all(
            item.extra_items.map(async (extraItem) => {
              const extraItemData = await this.extraItemService.findOne(
                extraItem.id,
                undefined,
                {
                  serialize: false,
                  relation: false,
                },
              );

              if (!extraItemData)
                throw new NotFoundException(
                  `Extra item with ID ${extraItem.id} not found`,
                );
            }),
          );
        }
      }),
    );

    // Calculate totals including extra items
    const totalAmount = items.reduce((sum, item) => {
      const itemTotal = item.price;
      const extraItemsTotal =
        item.extra_items?.reduce(
          (extraSum, extraItem) => extraSum + extraItem.price,
          0,
        ) || 0;
      return sum + itemTotal + extraItemsTotal;
    }, 0);

    const discountAmount = 0; // Implement discount logic here
    const finalAmount = totalAmount - discountAmount;

    // Create order
    const order = this.orderRepository.create({
      user,
      restaurant,
      items,
      payment_type,
      scheduled_pickup_time,
      total_amount: totalAmount,
      discount_amount: discountAmount,
      final_amount: finalAmount,
      status: OrderStatus.PENDING,
      table_number,
    });

    await this.orderRepository.save(order);
    return this.findOne(order.id);
  }

  async findAll(
    userId?: number,
    restaurantId?: number,
    status?: OrderStatus,
    paginationDto?: PaginationDto,
    filterDto?: FilterOrderDto,
  ) {
    const { page = 1, limit = 10 } = paginationDto || {};
    const skip = (page - 1) * limit;

    const where: any = {};

    // Apply existing filters
    if (userId) {
      where.user = { id: userId };
    }

    if (restaurantId) {
      where.restaurant = { id: restaurantId };
    }

    if (status) {
      where.status = status;
    }

    // Apply additional filters from filterDto
    if (filterDto) {
      // Override existing filters if provided in filterDto
      // if (filterDto.user_id) {
      //   where.user = { id: filterDto.user_id };
      // }

      if (filterDto.restaurant_id) {
        where.restaurant = { id: filterDto.restaurant_id };
      }

      if (filterDto.status) {
        where.status = filterDto.status;
      }

      if (filterDto.payment_type) {
        where.payment_type = filterDto.payment_type;
      }

      // Date range filters
      if (filterDto.start_date && filterDto.end_date) {
        where.created_at = Between(
          new Date(filterDto.start_date),
          new Date(filterDto.end_date),
        );
      } else if (filterDto.start_date) {
        where.created_at = MoreThanOrEqual(new Date(filterDto.start_date));
      } else if (filterDto.end_date) {
        where.created_at = LessThanOrEqual(new Date(filterDto.end_date));
      }

      // Amount range filters
      if (filterDto.min_amount && filterDto.max_amount) {
        where.final_amount = Between(
          filterDto.min_amount,
          filterDto.max_amount,
        );
      } else if (filterDto.min_amount) {
        where.final_amount = MoreThanOrEqual(filterDto.min_amount);
      } else if (filterDto.max_amount) {
        where.final_amount = LessThanOrEqual(filterDto.max_amount);
      }
    }

    // Handle search parameter - creating a more complex query
    let searchCondition = null;
    if (filterDto?.search) {
      const search = `%${filterDto.search}%`;
      searchCondition = [{ table_number: Like(search) }];
    }

    // Build query with search conditions if needed
    let query = this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.user', 'user')
      .leftJoinAndSelect('order.restaurant', 'restaurant')
      .where(where);

    // Add search conditions if present
    if (searchCondition) {
      query = query.andWhere(searchCondition);
    }

    // Apply pagination and execute
    const [orders, total] = await query
      .orderBy('order.created_at', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    const totalPages = Math.ceil(total / limit);

    const transformedOrders = plainToInstance(OrderResponseDto, orders, {
      excludeExtraneousValues: true,
    });

    const response = new PaginatedResponseDto<OrderResponseDto>();
    response.data = transformedOrders;
    response.meta = {
      total,
      page,
      limit,
      total_pages: totalPages,
    };

    return response;
  }

  async findOne(id: number) {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['user', 'restaurant'],
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return plainToInstance(OrderResponseDto, order, {
      excludeExtraneousValues: true,
    });
  }

  async update(id: number, updateOrderDto: UpdateOrderDto) {
    const order = await this.findOne(id);

    // Validate status transition
    // if (updateOrderDto.status) {
    //   this.validateStatusTransition(order.status, updateOrderDto.status);
    // }

    // Update order
    Object.assign(order, updateOrderDto);
    await this.orderRepository.save(order);

    return this.findOne(id);
  }

  async remove(id: number) {
    const order = await this.findOne(id);

    // Only allow cancellation of pending orders
    if (order.status !== OrderStatus.PENDING) {
      throw new BadRequestException('Only pending orders can be cancelled');
    }

    // await this.orderRepository.remove(order);
    return { message: 'Order removed successfully' };
  }

  private validateStatusTransition(
    currentStatus: OrderStatus,
    newStatus: OrderStatus,
  ) {
    const validTransitions = {
      [OrderStatus.PENDING]: [OrderStatus.CONFIRMED, OrderStatus.CANCELLED],
      [OrderStatus.CONFIRMED]: [OrderStatus.PREPARING, OrderStatus.CANCELLED],
      [OrderStatus.PREPARING]: [OrderStatus.READY, OrderStatus.CANCELLED],
      [OrderStatus.READY]: [OrderStatus.COMPLETED, OrderStatus.CANCELLED],
      [OrderStatus.COMPLETED]: [],
      [OrderStatus.CANCELLED]: [],
    };

    if (!validTransitions[currentStatus].includes(newStatus)) {
      throw new BadRequestException(
        `Invalid status transition from ${currentStatus} to ${newStatus}`,
      );
    }
  }
}
