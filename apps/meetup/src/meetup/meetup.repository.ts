import { PrismaService } from '@app/common';
import { Injectable } from '@nestjs/common';
import { Meetup } from './types/meetup-entity.type';

@Injectable()
export class MeetupRepository {
  constructor(private readonly prisma: PrismaService) {}

  public async readById(id: string): Promise<Meetup> {
    const meetup = await this.prisma.meetups.findUnique({
      where: { id: Number(id) },
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
}
