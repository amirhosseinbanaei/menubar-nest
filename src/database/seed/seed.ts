import { NestFactory } from '@nestjs/core';
import { SeederModule } from './seed.module';
import { Seeder } from './seed.service';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(SeederModule, {
    logger: ['error', 'warn', 'log'],
  });

  const logger = new Logger('Seeder');

  try {
    logger.log('🌱 Starting database seeding...');

    const seeder = app.get(Seeder);
    await seeder.seed();

    logger.log('✅ Database seeding completed successfully!');
    await app.close();
    process.exit(0);
  } catch (error) {
    logger.error('❌ Database seeding failed!');
    logger.error(error?.message || error);

    await app.close();
    process.exit(1);
  }
}

// Handle unexpected errors
process.on('unhandledRejection', (error) => {
  console.error('❌ Unhandled Promise Rejection:', error);
  process.exit(1);
});

bootstrap();
