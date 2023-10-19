import {
  PrismaService,
  ReadAllResult,
  TransactionClient,
  defaultPagination,
  defaultSorting,
} from '@app/common';
import { Injectable } from '@nestjs/common';
import { CreateUserDto, FindUserDto, UpdateUserDto, User } from './dto';
import { IReadAllUserOptions } from './types';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async readAll(
    readAllOptions: IReadAllUserOptions,
  ): Promise<ReadAllResult<User>> {
    const { sorting, pagination } = readAllOptions;

    const { column, direction } = sorting ?? defaultSorting;
    const { offset, size } = pagination ?? defaultPagination;

    const users = await this.prisma.users.findMany({
      skip: offset,
      take: Number(size),
      orderBy: {
        [column]: direction,
      },
    });

    return { totalRecordsNumber: users.length, records: users };
  }

  async create(
    createUserDto: CreateUserDto,
    transaction?: TransactionClient,
  ): Promise<User> {
    const executer = transaction ? transaction : this.prisma;
    const createdUser = await executer.users.create({
      data: { ...createUserDto, role: 'USER' },
    });

    return createdUser;
  }

  async readByUniqueField(options: FindUserDto): Promise<User> {
    const user = await this.prisma.users.findMany({
      where: { ...options },
    });

    return user.length ? user[0] : null;
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
    transaction?: TransactionClient,
  ): Promise<User> {
    const executer = transaction ? transaction : this.prisma;
    const user = await executer.users.update({
      where: { id },
      data: { ...updateUserDto },
    });

    return user;
  }

  async delete(id: number, transaction?: TransactionClient): Promise<void> {
    const executer = transaction ? transaction : this.prisma;
    await executer.users.delete({
      where: { id },
    });
  }
}
