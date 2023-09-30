import { JwtPayloadDto, ReadAllResult } from '@app/common';
import { Controller, ParseIntPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { CreateMeetupDto, Meetup, UpdateMeetupDto } from './dto';
import { MeetupService } from './meetup.service';
import { FrontendMeetup, IReadAllMeetupOptions } from './types';

@Controller()
export class MeetupController {
  constructor(private readonly meetupService: MeetupService) {}

  @MessagePattern('MEETUP_CREATE')
  async create(
    @Payload('createMeetupDto') createMeetupDto: CreateMeetupDto,
    @Payload('organizer') organizer: JwtPayloadDto,
  ): Promise<FrontendMeetup> {
    const createdMeetup = await this.meetupService.create(
      createMeetupDto,
      organizer,
    );

    return new FrontendMeetup(createdMeetup);
  }

  @MessagePattern('MEETUP_GET_BY_ID')
  async readById(
    @Payload('id', ParseIntPipe) id: number,
  ): Promise<FrontendMeetup> {
    const meetup = await this.meetupService.readById(id);

    return new FrontendMeetup(meetup);
  }

  @MessagePattern('MEETUP_GET_ALL')
  async readAll(
    @Payload('options') options: IReadAllMeetupOptions,
  ): Promise<ReadAllResult<Meetup>> {
    const meetups = await this.meetupService.readAll(options);

    return meetups;
  }

  @MessagePattern('MEETUP_UPDATE')
  async update(
    @Payload('id', ParseIntPipe) id: number,
    @Payload('updateMeetupDto') updateMeetupDto: UpdateMeetupDto,
  ): Promise<FrontendMeetup> {
    const updatedMeetup = await this.meetupService.update(id, updateMeetupDto);

    return new FrontendMeetup(updatedMeetup);
  }

  @MessagePattern('MEETUP_DELETE')
  async deleteById(@Payload('id', ParseIntPipe) id: number): Promise<string> {
    await this.meetupService.delete(id);

    return 'sucess';
  }
}
