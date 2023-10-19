import { PrismaService, TransactionClient } from '@app/common';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getJwt(
    userId: number,
    refreshToken: string,
  ): Promise<string | undefined> {
    const token = await this.prisma.tokens.findFirst({
      where: {
        userId,
        refreshToken,
      },
      select: {
        refreshToken: true,
      },
    });

    return token?.refreshToken;
  }

  async saveJwt(
    userId: number,
    refreshToken: string,
    transaction?: TransactionClient,
  ): Promise<void> {
    const executer = transaction ? transaction : this.prisma;
    await executer.tokens.create({
      data: {
        userId,
        refreshToken,
      },
    });
  }

  async deleteJwt(
    userId: number,
    refreshToken: string,
    transaction?: TransactionClient,
  ): Promise<void> {
    const executer = transaction ? transaction : this.prisma;
    await executer.tokens.deleteMany({
      where: {
        userId,
        refreshToken,
      },
    });
  }

  async deleteAllJwt(
    userId: number,
    transaction?: TransactionClient,
  ): Promise<void> {
    const executer = transaction ? transaction : this.prisma;
    await executer.tokens.deleteMany({
      where: { userId },
    });
  }
}
