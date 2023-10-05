import {
  PrismaService,
  ReadAllResult,
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
  ): Promise<Meetup> {
    const { tags, ...meetupOptions } = createMeetupDto;

    const tagsEntity = await this._getAndCreateTags(tags);

    const createdMeetup = await this.prisma.meetups.create({
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

    const { containsMeetupFilter, containsTagFilter } =
      MeetupFiltration.whereFilter(filters);

    const meetups = await this.prisma.meetups.findMany({
      where: { ...containsMeetupFilter, ...containsTagFilter },
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

  async update(id: number, updateMeetupDto: UpdateMeetupDto): Promise<Meetup> {
    const { tags, ...updateMeetupOptions } = updateMeetupDto;

    const tagsEntity = await this._getAndCreateTags(tags);

    const updatedMeetup = await this.prisma.meetups.update({
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

  async delete(id: number): Promise<void> {
    await this.prisma.meetups.update({
      where: { id },
      data: {
        tags: {
          deleteMany: { meetupId: id },
        },
      },
    });

    await this.prisma.meetups.delete({
      where: { id },
    });
  }

  private async _getAndCreateTags(createTagsDto: string[]): Promise<Tag[]> {
    const tags: Tag[] = [];

    if (!createTagsDto) return tags;

    for await (const createTagDto of createTagsDto) {
      const existingTag = await this.tagRepository.readBy({
        title: createTagDto,
      });
      if (!existingTag) {
        tags.push(await this.tagRepository.create({ title: createTagDto }));
        continue;
      }

      tags.push(existingTag);
    }

    return tags;
  }
}
