import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, Logger } from '@nestjs/common';

// Entities
import { Language } from '../../languages/entities/language.entity';

// Seed Data
import * as seedData from './seed.data';

// DTOs
import { CreateLanguageDto } from 'src/languages/dto/language.dto';

// Helper function to seed entities
async function seedEntities<T>(
  seedItems: T[],
  repository: Repository<T>,
  conditionFn: (item: T) => object,
  displayFn: (item: T) => string,
  entityName: string,
  logger: Logger,
): Promise<void> {
  for (const item of seedItems) {
    const condition = conditionFn(item);
    const existingEntity = await repository.findOne({ where: condition });
    if (!existingEntity) {
      await repository.save(item);
      logger.log(`✅ Added ${entityName}: ${displayFn(item)}`);
    } else {
      logger.warn(`⚠️ ${entityName} ${displayFn(item)} already exists`);
    }
  }
}

@Injectable()
export class Seeder {
  private readonly logger = new Logger(Seeder.name);

  constructor(
    @InjectRepository(Language)
    private readonly languageRepository: Repository<Language>,
    //  @InjectRepository(Restaurant)
    //  private readonly restaurantRepository: Repository<Restaurant>,
    //  @InjectRepository(RestaurantTranslation)
    //  private readonly restaurantTranslationRepository: Repository<RestaurantTranslation>,
    //  @InjectRepository(Category)
    //  private readonly categoryRepository: Repository<Category>,
    //  @InjectRepository(CategoryTranslation)
    //  private readonly categoryTranslationRepository: Repository<CategoryTranslation>,
  ) {}

  async seed() {
    try {
      await this.seedLanguages(seedData.languages);
    } catch (error) {
      this.logger.error('❌ Error during database seeding:', error.stack);
      throw error;
    }
  }

  async seedLanguages(languages: CreateLanguageDto[]) {
    await seedEntities(
      languages,
      this.languageRepository,
      (lang) => ({
        language_name: lang.language_name,
        language_code: lang.language_code,
      }),
      (lang) => lang.language_name,
      'Language',
      this.logger,
    );
  }
}
