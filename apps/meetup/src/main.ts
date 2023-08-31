import { NestFactory } from '@nestjs/core';
import { MeetupModule } from './meetup.module';
import { Transport } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';

const logger = new Logger('Meetup');

async function bootstrap() {
  const app = await NestFactory.createMicroservice(MeetupModule, {
    transport: Transport.TCP,
    options: {
      port: 4000,
    },
  });

  app.useLogger(logger);
  await app.listen();
}
bootstrap();
