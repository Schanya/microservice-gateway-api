import { PrismaService } from '@app/common';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MeetupService {
  constructor(private readonly prisma: PrismaService) {}

  getHello(name: string): string {
    return `Hello ${name}!`;
  }

  async getTags(): Promise<any> {
    return await this.prisma.tags.findMany();
  }
}
