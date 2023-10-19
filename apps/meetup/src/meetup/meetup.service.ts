import {
  JwtPayloadDto,
  PrismaService,
  ReadAllResult,
  TransactionClient,
} from '@app/common';
import { HttpStatus, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

import { CreateMeetupDto, Meetup, UpdateMeetupDto } from './dto';
import { IReadAllMeetupOptions } from './types';

import { MeetupRepository } from './meetup.repository';
import { MeetupEsService } from '../elasticsearch/meetup-elasticsearch.service';
import { MeetupSearchResult } from '../elasticsearch/types';

@Injectable()
export class MeetupService {
  constructor(
    private readonly meetupRepository: MeetupRepository,
    private readonly meetupEsService: MeetupEsService,
    private readonly prisma: PrismaService,
  ) {}

  async create(
    createMeeetupDto: CreateMeetupDto,
    organizer: JwtPayloadDto,
  ): Promise<Meetup> {
    const transactionResult = await this.prisma.$transaction(
      async (transaction: TransactionClient) => {
        const createdMeetup = await this.meetupRepository.create(
          createMeeetupDto,
          organizer.id,
          transaction,
        );

        await this.meetupEsService.create(createdMeetup);

        return createdMeetup;
      },
    );

    return transactionResult;
  }

  async readById(id: number): Promise<Meetup> {
    const meetup = await this.meetupRepository.readById(id);

    return meetup;
  }

  async readAll(
    options: IReadAllMeetupOptions,
  ): Promise<ReadAllResult<Meetup>> {
    const meetups = await this.meetupRepository.readAll(options);

    return meetups;
  }

  async search(searchText: string): Promise<MeetupSearchResult> {
    const result = await this.meetupEsService.search(searchText);

    return result;
  }

  async update(
    id: number,
    updateMeetupDto: UpdateMeetupDto,
    transaction?: TransactionClient,
  ): Promise<Meetup> {
    const transactionResult = await this.prisma.$transaction(
      async (transaction: TransactionClient) => {
        await this._doesExistMeetup(id);

        const updatedMeetup = await this.meetupRepository.update(
          id,
          updateMeetupDto,
          transaction,
        );

        await this.meetupEsService.update(updatedMeetup);

        return updatedMeetup;
      },
    );

    return transactionResult;
  }

  async delete(id: number, transaction?: TransactionClient): Promise<void> {
    const transactionResult = await this.prisma.$transaction(
      async (transaction: TransactionClient) => {
        await this._doesExistMeetup(id);
        await this.meetupEsService.delete(id);

        await this.meetupRepository.delete(id, transaction);
      },
    );
  }

  async joinToMeetup(
    meetupId: number,
    member: JwtPayloadDto,
    transaction?: TransactionClient,
  ): Promise<Meetup> {
    const transactionResult = await this.prisma.$transaction(
      async (transaction: TransactionClient) => {
        await this._doesExistMeetup(meetupId);

        const isJoined = await this.meetupRepository.isJoined(
          meetupId,
          member.id,
          transaction,
        );
        if (isJoined) {
          throw new RpcException({
            message: `You are already joined to the meetup`,
            statusCode: HttpStatus.BAD_REQUEST,
          });
        }

        const meetup = await this.meetupRepository.joinToMeetup(
          meetupId,
          member.id,
          transaction,
        );

        return meetup;
      },
    );

    return transactionResult;
  }

  async leaveFromMeetup(
    meetupId: number,
    member: JwtPayloadDto,
    transaction?: TransactionClient,
  ): Promise<Meetup> {
    const transactionResult = await this.prisma.$transaction(
      async (transaction: TransactionClient) => {
        await this._doesExistMeetup(meetupId);

        const isJoined = await this.meetupRepository.isJoined(
          meetupId,
          member.id,
          transaction,
        );
        if (!isJoined) {
          throw new RpcException({
            message: `You aren\`t joined to the meetup`,
            statusCode: HttpStatus.BAD_REQUEST,
          });
        }

        const meetup = await this.meetupRepository.leaveFromMeetup(
          meetupId,
          member.id,
          transaction,
        );

        return meetup;
      },
    );

    return transactionResult;
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
