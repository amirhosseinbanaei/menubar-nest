import { Injectable, Logger } from '@nestjs/common';
import { LanguageSeeder } from './language.seeder';

@Injectable()
export class Seeder {
  constructor(private readonly languageSeeder: LanguageSeeder) {}

  async seedHelper(seeder, entityName: string) {
    const logger = new Logger();

    async function createdData() {
      return await Promise.all(seeder.create())
        .then((createdUsers) => {
          logger.debug(
            `No. of ${entityName} created : ` +
              createdUsers.filter(
                (nullValueOrCreatedUser) => nullValueOrCreatedUser,
              ).length,
          );
          return Promise.resolve(true);
        })
        .catch((error) => Promise.reject(error));
    }

    await createdData()
      .then((completed) => {
        logger.debug(`Successfully completed seeding ${entityName}...`);
        Promise.resolve(completed);
      })
      .catch((error) => {
        logger.error(`Failed seeding ${entityName}...`);
        Promise.reject(error);
      });
  }

  async seed() {
    await this.seedHelper(this.languageSeeder, 'languages');
  }
}
