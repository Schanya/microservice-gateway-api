import { PrismaService } from '@app/common';
import { Injectable } from '@nestjs/common';
import { CreateTagDto, FindTagDto, Tag, UpdateTagDto } from './dto';

@Injectable()
export class TagRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(createTagDto: CreateTagDto): Promise<Tag> {
    const createdTag = await this.prisma.tags.create({
      data: { ...createTagDto },
    });

    return createdTag;
  }

  async readBy(options: FindTagDto): Promise<Tag> {
    const tags = await this.prisma.tags.findMany({
      where: { ...options },
    });

    return tags.length ? tags[0] : null;
  }

  async update(id: number, updateTagDto: UpdateTagDto): Promise<Tag> {
    const updatedTag = await this.prisma.tags.update({
      where: { id },
      data: { ...updateTagDto },
    });

    return updatedTag;
  }

  async delete(id: number): Promise<void> {
    await this.prisma.tags.delete({
      where: { id },
    });
  }
}
