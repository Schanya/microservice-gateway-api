import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { MeetupService } from './meetup.service';
import { MeetupFrontend } from '@app/common';

@Controller('meetup')
export class MeetupController {
  constructor(private readonly meetupService: MeetupService) {}

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async readById(@Param('id') id: string): Promise<MeetupFrontend> {
    const tag = await this.meetupService.readById(id);
    return tag;
  }
}
