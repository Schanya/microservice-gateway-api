import { PrismaService } from '@app/common';
import { Injectable } from '@nestjs/common';
import { CreateUserDto, FindUserDto, User } from './dto';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = await this.prisma.users.create({
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

  async delete(id: number): Promise<void> {
    await this.prisma.users.delete({ where: { id } });
  }
}
