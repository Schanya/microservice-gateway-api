import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MeetupService } from './meetup.service';
import { MeetupFrontend } from '@app/common';

@Controller()
export class MeetupController {
  constructor(private readonly meetupService: MeetupService) {}

  @MessagePattern('MEETUP_GET_BY_ID')
  async readById(@Payload('id') id: string): Promise<MeetupFrontend> {
    const meetup = await this.meetupService.readById(id);
    return new MeetupFrontend(meetup);
  }
}
