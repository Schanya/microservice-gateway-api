import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';

import { MicroserviceAllExceptionsFilter, RmqModule } from '@app/common';

import { envSchemaOptions } from '../common/configs';

import { MeetupModule } from './meetup/meetup.module';

@Module({
  imports: [ConfigModule.forRoot(envSchemaOptions), RmqModule, MeetupModule],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: MicroserviceAllExceptionsFilter,
    },
  ],
})
export class MicroserviceModule {}
