import { Controller, ParseIntPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { UserService } from './user.service';
import { FrontendUser, IReadAllUserOptions } from './types';
import { AvatarDto, ReadAllResult } from '@app/common';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern('USER_GET_ALL')
  async readAll(
    @Payload('readAllUserOptions') readAllUserOptions: IReadAllUserOptions,
  ): Promise<ReadAllResult<FrontendUser>> {
    const users = await this.userService.readAll(readAllUserOptions);

    return {
      totalRecordsNumber: users.totalRecordsNumber,
      records: users.records.map((user) => new FrontendUser(user)),
    };
  }

  @MessagePattern('USER_GET_BY_ID')
  async readBy(@Payload('id') id: number): Promise<FrontendUser> {
    const user = await this.userService.readByUniqueField({ id });
    return new FrontendUser(user);
  }

  @MessagePattern('USER_DELETE')
  async deleteBy(@Payload('id') id: number): Promise<void> {
    await this.userService.delete(id);
  }

  @MessagePattern('USER_UPLOAD_AVATAR')
  async uploadAvatar(
    @Payload('id', ParseIntPipe) id: number,
    @Payload('filename') filename: string,
  ): Promise<AvatarDto> {
    const avatarDto = await this.userService.uploadAvatar(id, filename);
    return avatarDto;
  }

  @MessagePattern('USER_DOWNLOAD_AVATAR')
  async downloadAvatar(
    @Payload('id', ParseIntPipe) id: number,
  ): Promise<AvatarDto> {
    const avatarDto = await this.userService.downloadAvatar(id);
    return avatarDto;
  }

  @MessagePattern('USER_REMOVE_AVATAR')
  async removeAvatar(@Payload('id', ParseIntPipe) id: number) {
    const avatarDto = await this.userService.removeAvatar(id);
    return avatarDto;
  }
}
