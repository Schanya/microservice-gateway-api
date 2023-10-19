import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { JwtPayloadDto } from '@app/common';
import { sendMessage } from '@gateway/common/utils';

import { CreateUserDto, GoogleUserDto, User } from './dto';
import { FrontendJwt } from './types';

@Injectable()
export class AuthService {
  constructor(@Inject('AUTH') private readonly client: ClientProxy) {}

  async register(createUserDto: CreateUserDto): Promise<FrontendJwt> {
    const user = await this._sendMessageFromClient<FrontendJwt>(
      'AUTH_REGISTRATION',
      { createUserDto },
    );

    return user;
  }

  async login(user: User): Promise<FrontendJwt> {
    const tokens = await this._sendMessageFromClient<FrontendJwt>(
      'AUTH_LOCAL_LOGIN',
      { user },
    );

    return tokens;
  }

  async logout(jwtPayload: JwtPayloadDto, refreshToken: string): Promise<void> {
    await this._sendMessageFromClient<void>('AUTH_LOGOUT', {
      jwtPayload,
      refreshToken,
    });
  }

  async refresh(
    jwtPayload: JwtPayloadDto,
    refreshToken: string,
  ): Promise<FrontendJwt> {
    const tokens = await this._sendMessageFromClient<FrontendJwt>(
      'AUTH_REFRESH',
      { jwtPayload, refreshToken },
    );

    return tokens;
  }

  async googleLogin(googleUser: GoogleUserDto): Promise<FrontendJwt> {
    const tokens = await this._sendMessageFromClient<FrontendJwt>(
      'AUTH_GOOGLE_LOGIN',
      { googleUser },
    );

    return tokens;
  }

  async validateUser(email: string, password: string): Promise<JwtPayloadDto> {
    const validate = await this._sendMessageFromClient<JwtPayloadDto>(
      'AUTH_USER_VALIDATE',
      { email, password },
    );

    return validate;
  }

  private async _sendMessageFromClient<T>(
    metadata: string,
    data: any,
  ): Promise<T> {
    const res = await sendMessage<T>({ client: this.client, metadata, data });

    return res;
  }
}
