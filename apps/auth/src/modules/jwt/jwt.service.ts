import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtPayloadDto } from '@app/common';

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
}
