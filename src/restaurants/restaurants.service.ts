import { Injectable } from '@nestjs/common';
// import { CreateRestaurantDto } from './dto/restaurant.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Restaurant } from './entities/restaurant.entity';
import { Repository } from 'typeorm';
import { LanguagesService } from '../languages/languages.service';

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectRepository(Restaurant)
    private restaurantRepository: Repository<Restaurant>,
    private readonly languageService: LanguagesService,
  ) {}

  // async create(createRestaurantDto: CreateRestaurantDto) {
  //   return await this.restaurantRepository.save(createRestaurantDto);
  // }

  async findAll() {
    return await this.restaurantRepository.find({
      relations: ['languages', 'languages.languages'],
    });
  }

  async findOne(restaurant_id: number) {
    return await this.restaurantRepository.findOne({
      where: { id: restaurant_id },
      relations: ['languages', 'languages.languages'],
    });
  }

  // async addLanguageToRestaurant(
  //   createRestaurantLanguageDto: CreateRestaurantLanguageDto,
  // ) {
  //   const { language_code, restaurant_id } = createRestaurantLanguageDto;

  //   const restaurant = await this.findOne(restaurant_id);
  //   if (!restaurant) throw new NotFoundException('Restaurant not found !');

  //   const language = await this.languageService.findOne(language_code);
  //   if (!language) throw new NotFoundException('Language not found !');

  //   // const restaurantLanguages = await this.restaurantLanguageRepository.findOne(
  //   //   {
  //   //     where: { restaurant: { restaurant_id }, languages: { language_code } },
  //   //   },
  //   // );

  //   return await this.restaurantLanguageRepository.save({
  //     restaurant,
  //     languages: language,
  //   });
  // }

  // update(id: number) {
  //   return `This action updates a #${id} restaurant`;
  // }

  remove(id: number) {
    return `This action removes a #${id} restaurant`;
  }
}
