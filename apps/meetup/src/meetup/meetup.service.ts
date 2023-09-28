import { HttpStatus, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { JwtPayloadDto } from '@app/common';

import { CreateMeetupDto, Meetup, UpdateMeetupDto } from './dto';
import { MeetupRepository } from './meetup.repository';

@Injectable()
export class MeetupService {
  constructor(private readonly meetupRepository: MeetupRepository) {}

  async create(
    createMeeetupDto: CreateMeetupDto,
    organizer: JwtPayloadDto,
  ): Promise<Meetup> {
    const createdMeetup = await this.meetupRepository.create(
      createMeeetupDto,
      organizer.id,
    );

    return createdMeetup;
  }

  async readById(id: number): Promise<Meetup> {
    const meetup = await this.meetupRepository.readById(id);
    return meetup;
  }

  async update(id: number, updateMeetupDto: UpdateMeetupDto): Promise<Meetup> {
    this._doesExistMeetup(id);

    const updatedMeetup = await this.meetupRepository.update(
      id,
      updateMeetupDto,
    );

    return updatedMeetup;
  }

  async delete(id: number): Promise<void> {
    this._doesExistMeetup(id);

    await this.meetupRepository.delete(id);
  }

  private async _doesExistMeetup(id: number): Promise<void> {
    const existingMeetup = await this.meetupRepository.readById(id);
    if (!existingMeetup) {
      throw new RpcException({
        message: `The specified meetup does not exist`,
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }
  }
}
