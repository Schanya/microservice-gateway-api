import { PrismaService } from '@app/common';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtRepository {
  constructor(private readonly prisma: PrismaService) {}
}
