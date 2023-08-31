import { config } from 'dotenv';
config();

import { NestFactory } from '@nestjs/core';
import { MeetupModule } from './meetup.module';
import { Transport } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';

const logger = new Logger('Meetup');

async function bootstrap() {
  const app = await NestFactory.createMicroservice(MeetupModule, {
    transport: Transport.RMQ,
    options: {
      port: 4000,
      urls: [process.env.RABBIT_MQ_URI],
      queue: process.env.QUEUE_MEETUP_SERVICE,
      queueOptions: {
        durable: false,
      },
    },
  });

  app.useLogger(logger);
  await app.listen();
}
bootstrap();
