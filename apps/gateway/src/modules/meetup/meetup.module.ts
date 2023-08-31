import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { MEETUP_CLIENT_OPTIONS } from '../../common/constants/microservice.constants';
import { MeetupController } from './meetup.controller';
import { MeetupService } from './meetup.service';

@Module({
  imports: [
    ClientsModule.register({
      clients: [MEETUP_CLIENT_OPTIONS],
    }),
  ],
  controllers: [MeetupController],
  providers: [MeetupService],
  exports: [MeetupService],
})
export class MeetupModule {}
