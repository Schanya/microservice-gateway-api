import { BadGatewayException, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

import { AvatarDto, JwtPayloadDto, ReadAllResult } from '@app/common';

import { v4 } from 'uuid';
import { extname } from 'path';

import { AwsService } from '../aws/aws.service';
import { DownloadedFile } from 'easy-yandex-s3/types/EasyYandexS3';

import { sendMessage } from '@gateway/common/utils';
import { FrontendUser, IReadAllUserOptions } from './types';

@Injectable()
export class UserService {
  constructor(
    @Inject('AUTH') private readonly client: ClientProxy,
    private readonly awsService: AwsService,
    private readonly configService: ConfigService,
  ) {}

  async readAll(
    readAllUserOptions: IReadAllUserOptions,
  ): Promise<ReadAllResult<FrontendUser>> {
    const users = await this._sendMessageFromClient<
      ReadAllResult<FrontendUser>
    >('USER_GET_ALL', { readAllUserOptions });

    return users;
  }

  async readByUniqueField(id: number): Promise<FrontendUser> {
    const user = await this._sendMessageFromClient<FrontendUser>(
      'USER_GET_BY_ID',
      { id },
    );

    return user;
  }

  async delete(id: number): Promise<void> {
    await this._sendMessageFromClient<void>('USER_DELETE', { id });
  }

  async uploadAvatar(
    jwtPayload: JwtPayloadDto,
    file: Express.Multer.File,
  ): Promise<void> {
    const filename = `${v4()}${extname(file.originalname)}`;

    const isUpload = await this.awsService.upload(file, filename);

    if (!isUpload) {
      throw new BadGatewayException('Failed to upload image to server');
    }

    const avatarDto: AvatarDto = await this._sendMessageFromClient<AvatarDto>(
      'USER_UPLOAD_AVATAR',
      { id: jwtPayload.id, filename },
    );

    if (avatarDto.hasOldAvatar) {
      const folder: string = this.configService.get<string>('AWS_ROUTE_NAME');
      await this.awsService.remove(folder, avatarDto.oldAvatarFilename);
    }
  }

  async downloadAvatar(id: number): Promise<DownloadedFile> {
    const avatarDto: AvatarDto = await this._sendMessageFromClient<AvatarDto>(
      'USER_DOWNLOAD_AVATAR',
      { id },
    );

    const folder = this.configService.get<string>('AWS_ROUTE_NAME');
    const file = await this.awsService.download(
      folder,
      avatarDto.avatarFilename,
    );

    if (!file) {
      throw new BadGatewayException('Failed to download image from server');
    }

    return file;
  }

  async removeAvatar(jwtPayload: JwtPayloadDto): Promise<void> {
    const avatarDto: AvatarDto = await this._sendMessageFromClient<AvatarDto>(
      'USER_REMOVE_AVATAR',
      { id: jwtPayload.id },
    );

    const folder = this.configService.get<string>('AWS_ROUTE_NAME');
    const isRemoved = await this.awsService.remove(
      folder,
      avatarDto.avatarFilename,
    );

    if (!isRemoved) {
      throw new BadGatewayException('Failed to remove image from server');
    }
  }

  private async _sendMessageFromClient<T>(
    metadata: string,
    data: any,
  ): Promise<T> {
    const res = await sendMessage<T>({ client: this.client, metadata, data });

    return res;
  }
}
