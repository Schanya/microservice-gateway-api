import { Controller, Get } from '@nestjs/common';
import { MeetupService } from './meetup.service';

@Controller()
export class MeetupController {
  constructor(private readonly meetupService: MeetupService) {}

  @Get()
  async getHello(): Promise<string> {
    const helloValue = await this.meetupService.getHello();

    return helloValue;
  }
}
