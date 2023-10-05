import { Module } from '@nestjs/common';

import { DatabaseModule } from '@app/common';
import { EsModule } from '../elasticsearch/elasticsearch.module';
import { TagModule } from '../tag/tag.module';

import { MeetupController } from './meetup.controller';
import { MeetupRepository } from './meetup.repository';
import { MeetupService } from './meetup.service';

@Module({
  imports: [DatabaseModule, TagModule, EsModule],
  providers: [MeetupRepository, MeetupService],
  controllers: [MeetupController],
  exports: [MeetupService],
})
export class MeetupModule {}
