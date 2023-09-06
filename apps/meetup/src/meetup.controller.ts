import { Controller, Get } from '@nestjs/common';
import { MeetupService } from './meetup.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class MeetupController {
  constructor(private readonly meetupService: MeetupService) {}

  @MessagePattern('getHello')
  getHello(name: string): string {
    return this.meetupService.getHello(name);
  }

  @MessagePattern('getTags')
  getTags(): any {
    return this.meetupService.getTags();
  }
}
