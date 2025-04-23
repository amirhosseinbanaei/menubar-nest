import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Restaurant } from './entities/restaurant.entity';
import { DataSource, FindOptionsWhere, Repository } from 'typeorm';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { executeTransaction } from 'src/common/utils/transaction.util';
import { plainToInstance } from 'class-transformer';
import { RestaurantResponseDto } from './dto/response-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { RestaurantWorkingHours } from './entities/restaurant-hours.entity';
import { RestaurantSocial } from './entities/restaurant-socials.entity';
import { RestaurantTranslation } from './entities/restaurant-translation.entity';
import { FilterRestaurantDto } from './dto/filter-restaurant.dto';

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
        await manager.save(RestaurantTranslation, {
          name,
          description,
          restaurant: { id: restaurant.id },
          language: { language_code: language },
        });
      });

      return { id: restaurant.id, ...createRestaurantDto };
    });
  }

  async findAll(options?: {
    serialize?: boolean;
    extraWhereOption?: FindOptionsWhere<Restaurant>;
    extraRelation?: string[] | string;
  }) {
    const relations = ['translations', 'translations.language'];

    if (options.extraRelation) relations.push(...options.extraRelation);

    const restaurants = await this.restaurantRepository.find({
      relations,
    });

    if (options?.serialize)
      return plainToInstance(RestaurantResponseDto, restaurants, {
        excludeExtraneousValues: true,
      });

    return restaurants;
  }

  async findOne(
    restaurant_id: number,
    options?: {
      serialize?: boolean;
      fields?: FilterRestaurantDto | 'all';
    },
  ) {
    const relations = [];

    if (options && options.fields) {
      if (options.fields === 'all') {
        relations.push(
          ...['translations', 'workingHours', 'socials', 'assets'],
        );
      } else {
        relations.push(...options?.fields?.filter);
      }
    }

    const restaurant = await this.restaurantRepository.findOne({
      where: { id: restaurant_id },
      relations,
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

    const { translations, workingHours, socials, colorPaletteId } =
      updateCategoryDto;

    return await executeTransaction(this.dataSource, async (manager) => {
      if (translations) {
        translations.forEach(async (translationData) => {
          const { language, name, description } = translationData;
          await manager.save(RestaurantTranslation, {
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

      if (socials) {
        const savedSocials = [];
        socials.forEach(async (socialData) => {
          const { platform, url } = socialData;
          savedSocials.push({
            restaurant: { id: 6 },
            platform,
            url,
          });
        });
        await manager.save(RestaurantSocial, savedSocials);
      }

      if (colorPaletteId) {
        restaurant.color_palette_id = colorPaletteId;
        await manager.save(Restaurant, restaurant);
      }

      return { ...restaurant, ...updateCategoryDto };
    });
  }

  remove(id: number) {
    return `This action removes a #${id} restaurant`;
  }
}
