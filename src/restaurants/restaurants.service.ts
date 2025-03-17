import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Restaurant } from './entities/restaurant.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { executeTransaction } from 'src/common/utils/transaction.util';
import { RestaurantInformation } from './entities/restaurant-information.entity';
import { plainToInstance } from 'class-transformer';
import { RestaurantResponseDto } from './dto/response-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { RestaurantWorkingHours } from './entities/restaurant-hours.entity';

@Injectable()
export class RestaurantsService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Restaurant)
    private restaurantRepository: Repository<Restaurant>,
  ) {}

  async create(createRestaurantDto: CreateRestaurantDto) {
    // return await this.restaurantRepository.save(createRestaurantDto);
    const { translations } = createRestaurantDto;
    console.log(createRestaurantDto);
    return await executeTransaction(this.dataSource, async (manager) => {
      const restaurant = await manager.save(Restaurant, {
        logo: `http://localhost:4000/uploads/companies/aa`,
        languages: translations.map((t) => {
          return { language_code: t.language };
        }),
      });

      translations.forEach(async (categoryTranslationData) => {
        const { language, name, description } = categoryTranslationData;
        await manager.save(RestaurantInformation, {
          name,
          description,
          restaurant: { id: restaurant.id },
          language: { language_code: language },
        });
      });

      return { id: restaurant.id, ...createRestaurantDto };
    });
  }

  async findAll(options?: { serialize?: boolean }) {
    const restaurants = await this.restaurantRepository.find({
      relations: ['translations', 'translations.language'],
    });

    if (options?.serialize)
      return plainToInstance(RestaurantResponseDto, restaurants, {
        excludeExtraneousValues: true,
      });

    return restaurants;
  }

  async findOne(restaurant_id: number, options?: { serialize?: boolean }) {
    const restaurant = await this.restaurantRepository.findOne({
      where: { id: restaurant_id },
      relations: ['languages', 'translations', 'translations.language'],
    });

    if (!restaurant)
      throw new NotFoundException(
        `Restaurant with ID ${restaurant_id} not found.`,
      );

    if (options?.serialize)
      return plainToInstance(RestaurantResponseDto, restaurant, {
        excludeExtraneousValues: true,
      });

    return restaurant;
  }

  async update(
    id: number,
    updateCategoryDto: UpdateRestaurantDto,
    newImageFile?: Express.Multer.File,
  ) {
    const restaurant = (await this.findOne(id)) as Restaurant;

    if (!restaurant) return null;

    const { translations, workingHours } = updateCategoryDto;

    return await executeTransaction(this.dataSource, async (manager) => {
      if (translations) {
        translations.forEach(async (restaurantInformation) => {
          const { language, name, description } = restaurantInformation;
          await manager.save(RestaurantInformation, {
            name,
            description,
            restaurant,
            language: { language_code: language },
          });
        });
      }

      if (workingHours) {
        const restaurantWorkingHours = [];
        workingHours.forEach(async (workingHours) => {
          restaurantWorkingHours.push({
            ...workingHours,
            restaurant: { id: 6 },
          });
        });
        await manager.save(RestaurantWorkingHours, restaurantWorkingHours);
      }

      return { ...restaurant, ...updateCategoryDto };
    });
  }

  remove(id: number) {
    return `This action removes a #${id} restaurant`;
  }
}
