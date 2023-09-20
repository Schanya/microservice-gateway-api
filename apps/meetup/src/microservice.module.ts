import { RmqModule } from '@app/common';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { envSchemaOptions } from '../common/configs/env-schema.config';
import { MeetupModule } from './meetup/meetup.module';

@Module({
  imports: [ConfigModule.forRoot(envSchemaOptions), RmqModule, MeetupModule],
  controllers: [],
  providers: [],
})
export class MicroserviceModule {}
