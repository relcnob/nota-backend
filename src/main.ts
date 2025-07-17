import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AppDataSource } from './config/data-source';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  try {
    await AppDataSource.initialize();
    console.log('✅ Database connection established');
  } catch (err) {
    console.error('❌ Failed to connect to the database', err);
  }

  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.SERVER_PORT || 5000);
}

bootstrap();
