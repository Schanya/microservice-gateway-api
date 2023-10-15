import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtPayloadDto, PrismaService, TransactionClient } from '@app/common';

import { JwtService as NestJwtService } from '@nestjs/jwt';
import { JwtRepository } from './jwt.repository';

@Injectable()
export class JwtService {
  constructor(
    private readonly jwtRepository: JwtRepository,
    private readonly nestJwtService: NestJwtService,
    private readonly configService: ConfigService,
  ) {}

  public async generateAccessJwt(payload: JwtPayloadDto): Promise<string> {
    const accessToken = await this.nestJwtService.signAsync(payload, {
      secret: this.configService.get('ACCESS_TOKEN_SECRET'),
      expiresIn: this.configService.get('ACCESS_TOKEN_EXPIRED'),
    });

    return accessToken;
  }

  public async generateRefreshJwt(payload: JwtPayloadDto): Promise<string> {
    const refreshToken = await this.nestJwtService.signAsync(payload, {
      secret: this.configService.get('REFRESH_TOKEN_SECRET'),
      expiresIn: this.configService.get('REFRESH_TOKEN_EXPIRED'),
    });

    return refreshToken;
  }

  public async isValidRefreshJwt(jwt: string): Promise<boolean> {
    try {
      await this.nestJwtService.verifyAsync(jwt, {
        secret: this.configService.get('REFRESH_TOKEN_SECRET'),
        maxAge: this.configService.get('REFRESH_TOKEN_EXPIRED'),
      });
    } catch {
      return false;
    }
    return true;
  }

  public async getJwt(
    userId: number,
    refreshToken: string,
  ): Promise<string | undefined> {
    const jwt = await this.jwtRepository.getJwt(userId, refreshToken);

    return jwt;
  }

  public async saveJwt(
    userId: number,
    refreshToken: string,
    transaction?: TransactionClient,
  ): Promise<void> {
    await this.jwtRepository.saveJwt(userId, refreshToken, transaction);
  }

  public async deleteJwt(
    userId: number,
    refreshToken: string,
    transaction?: TransactionClient,
  ): Promise<void> {
    await this.jwtRepository.deleteJwt(userId, refreshToken, transaction);
  }

  public async deleteAllJwt(
    userId: number,
    transaction?: TransactionClient,
  ): Promise<void> {
    await this.jwtRepository.deleteAllJwt(userId, transaction);
  }
}
