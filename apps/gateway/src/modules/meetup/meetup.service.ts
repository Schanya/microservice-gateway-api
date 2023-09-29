import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { JwtPayloadDto } from '@app/common';
import { sendMessage } from '@gateway/common/utils';

import { CreateMeetupDto, UpdateMeetupDto } from './dto';
import { FrontendMeetup, IReadAllMeetupOptions } from './types';

@Injectable()
export class MeetupService {
  constructor(
    @Inject('MEETUP')
    private readonly client: ClientProxy,
  ) {}

  async create(
    createMeetupDto: CreateMeetupDto,
    organizer: JwtPayloadDto,
  ): Promise<FrontendMeetup> {
    const createdMeetup = await sendMessage<FrontendMeetup>({
      client: this.client,
      metadata: 'MEETUP_CREATE',
      data: { createMeetupDto, organizer },
    });

    return createdMeetup;
  }

  async readById(id: string): Promise<FrontendMeetup> {
    const meetup: FrontendMeetup = await sendMessage({
      client: this.client,
      metadata: 'MEETUP_GET_BY_ID',
      data: { id },
    });

    return meetup;
  }

  async readAll(options: IReadAllMeetupOptions): Promise<FrontendMeetup[]> {
    const meetups: FrontendMeetup[] = await sendMessage({
      client: this.client,
      metadata: 'MEETUP_GET_ALL',
      data: { options },
    });

    return meetups;
  }

  async update(
    id: number,
    updateMeetupDto: UpdateMeetupDto,
  ): Promise<FrontendMeetup> {
    const updatedMeetup = await sendMessage<FrontendMeetup>({
      client: this.client,
      metadata: 'MEETUP_UPDATE',
      data: { id, updateMeetupDto },
    });

    return updatedMeetup;
  }

  async delete(id: number): Promise<void> {
    await sendMessage({
      client: this.client,
      metadata: 'MEETUP_DELETE',
      data: { id },
    });
  }
}
