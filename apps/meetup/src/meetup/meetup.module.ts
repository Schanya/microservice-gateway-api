import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { DatabaseModule } from '@app/common';
import { envSchemaOptions } from 'apps/meetup/common/configs/env-schema.config';

import { MeetupController } from './meetup.controller';
import { MeetupService } from './meetup.service';
import { MeetupRepository } from './meetup.repository';
import { TagModule } from '../tag/tag.module';

@Module({
  imports: [ConfigModule.forRoot(envSchemaOptions), DatabaseModule, TagModule],
  controllers: [MeetupController],
  providers: [MeetupRepository, MeetupService],
  exports: [MeetupService],
})
export class MeetupModule {}
