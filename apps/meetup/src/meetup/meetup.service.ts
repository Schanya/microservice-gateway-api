import { Injectable } from '@nestjs/common';
import { MeetupRepository } from './meetup.repository';
import { Meetup } from './types/meetup-entity.type';

@Injectable()
export class MeetupService {
  constructor(private readonly meetupRepositiry: MeetupRepository) {}

  async readById(id: string): Promise<Meetup> {
    const meetup = await this.meetupRepositiry.readById(id);
    return meetup;
  }
}
