import { HttpStatus, Injectable } from '@nestjs/common';
import { TagRepository } from './tag.repository';
import { CreateTagDto, FindTagDto, Tag, UpdateTagDto } from './dto';
import { RpcException } from '@nestjs/microservices';

Injectable();
export class TagService {
  constructor(private readonly tagRepository: TagRepository) {}

  async create(createTagDto: CreateTagDto): Promise<Tag> {
    const existingTag = await this.tagRepository.readBy({
      title: createTagDto.title,
    });

    if (!existingTag) {
      const createdTag = await this.tagRepository.create(createTagDto);

      return createdTag;
    }

    return existingTag;
  }

  async readBy(options: FindTagDto): Promise<Tag> {
    const tag = await this.tagRepository.readBy(options);

    return tag;
  }

  async update(id: number, updateTagDto: UpdateTagDto): Promise<Tag> {
    const updatedTag = await this.tagRepository.update(id, updateTagDto);

    return updatedTag;
  }

  async delete(id: number): Promise<void> {
    const existingTag = await this.tagRepository.readBy({ id });
    if (!existingTag) {
      throw new RpcException({
        message: `The specified tag does not exist`,
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }

    await this.tagRepository.delete(id);
  }
}
