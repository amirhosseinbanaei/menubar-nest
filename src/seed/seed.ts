import { NestFactory } from '@nestjs/core';
import { SeederModule } from './seeder.module';
import { Seeder } from './seeder';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(SeederModule);
  const logger = appContext.get(Logger);
  const seeder = appContext.get(Seeder);

  try {
    await seeder.seed();
    logger.debug('Seeding complete!');
  } catch (error) {
    logger.error('Seeding failed!');
    throw error;
  } finally {
    await appContext.close();
    process.exit(1);
  }
}

bootstrap();
