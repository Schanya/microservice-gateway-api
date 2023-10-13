import { AvatarDto, JwtPayloadDto, ReadAllResult } from '@app/common';
import { BadGatewayException, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { v4 } from 'uuid';
import { sendMessage } from '@gateway/common/utils';
import { FrontendUser, IReadAllUserOptions } from './types';
import { extname } from 'path';
import { AwsService } from '../aws/aws.service';
import { ConfigService } from '@nestjs/config';
import { DownloadedFile } from 'easy-yandex-s3/types/EasyYandexS3';

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
  ): Promise<void> {
    const filename = `${v4()}${extname(file.originalname)}`;

    const isUpload = await this.awsService.upload(file, filename);

    if (!isUpload) {
      throw new BadGatewayException('Failed to upload image to server');
    }

    const avatarDto: AvatarDto = await sendMessage<AvatarDto>({
      client: this.client,
      metadata: 'USER_UPLOAD_AVATAR',
      data: {
        id: jwtPayload.id,
        filename,
      },
    });

    if (avatarDto.hasOldAvatar) {
      const folder: string = this.configService.get<string>('AWS_ROUTE_NAME');
      await this.awsService.remove(folder, avatarDto.oldAvatarFilename);
    }
  }

  async downloadAvatar(id: number): Promise<DownloadedFile> {
    const avatarDto: AvatarDto = await sendMessage<AvatarDto>({
      client: this.client,
      metadata: 'USER_DOWNLOAD_AVATAR',
      data: { id },
    });

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
    const avatarDto: AvatarDto = await sendMessage<AvatarDto>({
      client: this.client,
      metadata: 'USER_REMOVE_AVATAR',
      data: { id: jwtPayload.id },
    });

    const folder = this.configService.get<string>('AWS_ROUTE_NAME');
    const isRemoved = await this.awsService.remove(
      folder,
      avatarDto.avatarFilename,
    );

    if (!isRemoved) {
      throw new BadGatewayException('Failed to remove image from server');
    }
  }
}
