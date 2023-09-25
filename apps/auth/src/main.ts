import { config } from 'dotenv';
config();

import { RmqService } from '@app/common';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AuthMicroserviceModule } from './auth-microservice.module';

const logger = new Logger('Meetup');

async function bootstrap() {
  const app = await NestFactory.create(AuthMicroserviceModule);

  const rmqService = app.get<RmqService>(RmqService);

  app.connectMicroservice(rmqService.getOptions('AUTH'));

  app.useLogger(logger);

  await app.startAllMicroservices();
}
bootstrap();
