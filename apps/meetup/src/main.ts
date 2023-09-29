import { config } from 'dotenv';
config();

import { RmqService } from '@app/common';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceModule } from './meetup-microservice.module';

const logger = new Logger('Meetup');

async function bootstrap() {
  const app = await NestFactory.create(MicroserviceModule);

  const rmqService = app.get<RmqService>(RmqService);

  app.connectMicroservice(rmqService.getOptions('MEETUP'));

  app.useLogger(logger);

  await app.startAllMicroservices();
}
bootstrap();
