import { PrismaService } from '@app/common';
import { Injectable } from '@nestjs/common';
import { CreateUserDto, User } from './dto';
import { FindUserDto } from './dto/find-user.dto';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = await this.prisma.users.create({
      data: { ...createUserDto, role: 'USER' },
    });

    return createdUser;
  }

  async readBy(options: FindUserDto): Promise<User> {
    const user = await this.prisma.users.findMany({
      where: { ...options },
    });

    return user.length ? user[0] : null;
  }

  async delete(id: number): Promise<void> {
    await this.prisma.users.delete({ where: { id } });
  }
}
