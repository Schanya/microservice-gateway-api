import { Controller, ParseIntPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MeetupService } from './meetup.service';
import { CreateMeetupDto, UpdateMeetupDto } from './dto';
import { FrontendMeetup } from './types/fronted-meetup.type';

@Controller()
export class MeetupController {
  constructor(private readonly meetupService: MeetupService) {}

  @MessagePattern('MEETUP_CREATE')
  async create(
    @Payload('createMeetupDto') createMeetupDto: CreateMeetupDto,
  ): Promise<FrontendMeetup> {
    const createdMeetup = await this.meetupService.create(createMeetupDto);
    return new FrontendMeetup(createdMeetup);
  }

  @MessagePattern('MEETUP_GET_BY_ID')
  async readById(
    @Payload('id', ParseIntPipe) id: number,
  ): Promise<FrontendMeetup> {
    const meetup = await this.meetupService.readById(id);
    return new FrontendMeetup(meetup);
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
