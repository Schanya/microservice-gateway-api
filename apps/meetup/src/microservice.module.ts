import { RmqModule } from '@app/common';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { envSchemaOptions } from '../common/configs/env-schema.config';
import { MeetupModule } from './meetup/meetup.module';
import { MicroserviceAllExceptionsFilter } from '@app/common/filters/microservice-all-exception.filter';
import { APP_FILTER } from '@nestjs/core';

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
