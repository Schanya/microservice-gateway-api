import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { JwtPayloadDto } from '@app/common';
import { sendMessage } from '@gateway/common/utils';

import { CreateUserDto, User } from './dto';
import { FrontendJwt } from './types';

@Injectable()
export class AuthService {
  constructor(@Inject('AUTH') private readonly client: ClientProxy) {}

  async register(createUserDto: CreateUserDto): Promise<FrontendJwt> {
    const user = await sendMessage<FrontendJwt>({
      client: this.client,
      metadata: 'AUTH_REGISTRATION',
      data: { createUserDto },
    });

    return user;
  }

  async login(user: User): Promise<FrontendJwt> {
    const tokens = await sendMessage<FrontendJwt>({
      client: this.client,
      metadata: 'AUTH_LOCAL_LOGIN',
      data: { user },
    });

    return tokens;
  }

  async validateUser(email: string, password: string): Promise<JwtPayloadDto> {
    const validate = await sendMessage<JwtPayloadDto>({
      client: this.client,
      metadata: 'AUTH_USER_VALIDATE',
      data: { email, password },
    });

    return validate;
  }
}
