import {
  PrismaService,
  ReadAllResult,
  TransactionClient,
  defaultPagination,
  defaultSorting,
} from '@app/common';
import { Injectable } from '@nestjs/common';

import { CreateMeetupDto, Meetup, UpdateMeetupDto } from './dto';
import { MeetupFiltration } from './filters';
import { IReadAllMeetupOptions } from './types';

import { Tag } from '../tag/dto';
import { TagRepository } from '../tag/tag.repository';

@Injectable()
export class MeetupRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tagRepository: TagRepository,
  ) {}

  async create(
    createMeetupDto: CreateMeetupDto,
    organizerId: number,
    transaction?: TransactionClient,
  ): Promise<Meetup> {
    const { tags, ...meetupOptions } = createMeetupDto;
    const executer = transaction ? transaction : this.prisma;

    const tagsEntity = await this._getAndCreateTags(tags, transaction);

    const createdMeetup = await executer.meetups.create({
      data: {
        ...meetupOptions,
        organizerId: organizerId,
        tags: {
          create: tagsEntity.map((tag) => ({ tag: { connect: { ...tag } } })),
        },
      },
      include: {
        tags: { select: { tag: true } },
      },
    });

    return createdMeetup;
  }

  async readById(id: number): Promise<Meetup> {
    const meetup = await this.prisma.meetups.findUnique({
      where: { id: id },
      include: {
        tags: {
          select: {
            tag: true,
          },
        },
      },
    });

    return meetup;
  }

  async readAll(
    options: IReadAllMeetupOptions,
  ): Promise<ReadAllResult<Meetup>> {
    const { sorting, pagination, filters } = options;

    const { column, direction } = sorting ?? defaultSorting;
    const { offset, size } = pagination ?? defaultPagination;

    const { containsMeetupFilter, containsTagFilter, geolocationFilters } =
      MeetupFiltration.whereFilter(filters);

    const geopositionSearchParam = {};

    if (Object.keys(geolocationFilters).length) {
      const { latitude, longitude } = geolocationFilters;
      const query = await this.prisma.$queryRaw<
        { id: number }[]
      >`SELECT id FROM "Meetups" WHERE ST_DWithin(ST_MakePoint(longitude::float, latitude::float), ST_MakePoint(${longitude}::float, ${latitude}::float)::geography, 100 * 1000)`;

      geopositionSearchParam['id'] = { in: query.map(({ id }) => id) };
    }

    const meetups = await this.prisma.meetups.findMany({
      where: {
        ...containsMeetupFilter,
        ...containsTagFilter,
        ...geopositionSearchParam,
      },
      orderBy: { [column]: direction },
      skip: offset,
      take: Number(size),
      include: {
        tags: {
          select: {
            tag: true,
          },
        },
      },
    });

    return { totalRecordsNumber: meetups.length, records: meetups };
  }

  async update(
    id: number,
    updateMeetupDto: UpdateMeetupDto,
    transaction?: TransactionClient,
  ): Promise<Meetup> {
    const { tags, ...updateMeetupOptions } = updateMeetupDto;
    const executer = transaction ? transaction : this.prisma;

    const tagsEntity = await this._getAndCreateTags(tags, transaction);

    const updatedMeetup = await executer.meetups.update({
      where: { id },
      data: {
        ...updateMeetupOptions,
        tags: {
          deleteMany: { meetupId: id },
          create: tagsEntity.map((tag) => ({ tag: { connect: { ...tag } } })),
        },
      },
      include: {
        tags: {
          select: {
            tag: true,
          },
        },
      },
    });

    return updatedMeetup;
  }

  async delete(id: number, transaction?: TransactionClient): Promise<void> {
    const executer = transaction ? transaction : this.prisma;

    await executer.meetups.update({
      where: { id },
      data: {
        tags: {
          deleteMany: { meetupId: id },
        },
      },
    });

    await executer.meetups.delete({
      where: { id },
    });
  }

  async joinToMeetup(
    meetupId: number,
    memberId: number,
    transaction?: TransactionClient,
  ): Promise<Meetup> {
    const executer = transaction ? transaction : this.prisma;
    const meetup = await executer.meetups.update({
      where: { id: meetupId },
      data: {
        members: {
          create: {
            userId: memberId,
          },
        },
      },

      include: {
        members: { select: { user: { select: { id: true, email: true } } } },
      },
    });

    return meetup;
  }

  async leaveFromMeetup(
    meetupId: number,
    memberId: number,
    transaction?: TransactionClient,
  ): Promise<Meetup> {
    const executer = transaction ? transaction : this.prisma;
    const meetup = await executer.meetups.update({
      where: { id: meetupId },
      data: {
        members: {
          deleteMany: {
            userId: memberId,
          },
        },
      },

      include: {
        members: { select: { user: { select: { id: true, email: true } } } },
      },
    });

    return meetup;
  }

  async isJoined(
    meetupId: number,
    memberId: number,
    transaction?: TransactionClient,
  ): Promise<boolean> {
    const executer = transaction ? transaction : this.prisma;

    const meetups = await executer.meetupsToUsers.findMany({
      where: {
        meetupId: meetupId,
        userId: memberId,
      },
    });

    return meetups.length !== 0;
  }

  private async _getAndCreateTags(
    createTagsDto: string[],
    transaction?: TransactionClient,
  ): Promise<Tag[]> {
    const tags: Tag[] = [];

    if (!createTagsDto) return tags;

    for await (const createTagDto of createTagsDto) {
      const existingTag = await this.tagRepository.readBy({
        title: createTagDto,
      });
      if (!existingTag) {
        tags.push(
          await this.tagRepository.create({ title: createTagDto }, transaction),
        );
        continue;
      }

      tags.push(existingTag);
    }

    return tags;
  }
}
