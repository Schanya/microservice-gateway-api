import { JwtPayloadDto, ReadAllResult } from '@app/common';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { sendMessage } from '@gateway/common/utils';
import { FrontendUser, IReadAllUserOptions } from './types';

@Injectable()
export class UserService {
  constructor(@Inject('AUTH') private readonly client: ClientProxy) {}

  async readAll(
    readAllUserOptions: IReadAllUserOptions,
  ): Promise<ReadAllResult<FrontendUser>> {
    const users = await sendMessage<ReadAllResult<FrontendUser>>({
      client: this.client,
      metadata: 'USER_GET_ALL',
      data: { readAllUserOptions },
    });

    return users;
  }

  async readByUniqueField(id: number): Promise<FrontendUser> {
    const user = await sendMessage<FrontendUser>({
      client: this.client,
      metadata: 'USER_GET_BY_ID',
      data: { id },
    });

    return user;
  }

  async delete(id: number): Promise<void> {
    await sendMessage<void>({
      client: this.client,
      metadata: 'USER_DELETE',
      data: {
        id,
      },
    });
  }

  async uploadAvatar(
    jwtPayload: JwtPayloadDto,
    file: Express.Multer.File,
  ): Promise<string> {
    return 'in progress';
  }

  async downloadAvatar(id: number): Promise<string> {
    return 'in progress';
  }

  async removeAvatar(jwtPayload: JwtPayloadDto): Promise<string> {
    return 'in progress';
  }
}
