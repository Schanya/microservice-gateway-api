import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import * as cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.use(cookieParser());

  app.setBaseViewsDir('./apps/gateway/src/modules/meetup/templates');
  app.setViewEngine('ejs');

  await app.listen(3000);
}
bootstrap();
