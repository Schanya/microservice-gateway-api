import { HttpStatus, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

import { UserRepository } from './user.repository';
import { CreateUserDto, FindUserDto, User } from './dto';
import { AvatarDto, ReadAllResult } from '@app/common';
import { FrontendUser, IReadAllUserOptions } from './types';
import { JwtService } from '../jwt/jwt.service';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async readAll(
    readAllOptions: IReadAllUserOptions,
  ): Promise<ReadAllResult<FrontendUser>> {
    const readAllUser = await this.userRepository.readAll(readAllOptions);

    return readAllUser;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existedUser = await this.readByUniqueField({
      email: createUserDto.email,
    });

    if (existedUser) {
      throw new RpcException({
        message: `The specified user already exists`,
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }

    const createdUser = await this.userRepository.create(createUserDto);

    return createdUser;
  }

  async readByUniqueField(options: FindUserDto): Promise<User> {
    const user = await this.userRepository.readByUniqueField(options);

    return user;
  }

  async delete(id: number): Promise<void> {
    await this._doesUserExist({ id });

    await this.jwtService.deleteAllJwt(id);

    await this.userRepository.delete(id);
  }

  private async _doesUserExist(options: FindUserDto): Promise<void> {
    const existingUser = await this.userRepository.readByUniqueField(options);
    if (!existingUser) {
      throw new RpcException({
        message: `The specified user does not exist`,
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }
  }

  async uploadAvatar(id: number, filename: string): Promise<AvatarDto> {
    const user = await this.userRepository.readByUniqueField({ id });

    const oldAvatarFilename = user.avatar;

    const avatarDto: AvatarDto = { avatarFilename: filename };

    if (oldAvatarFilename) {
      avatarDto.hasOldAvatar = true;
      avatarDto.oldAvatarFilename = oldAvatarFilename;
    }

    await this.userRepository.uploadAvatar(id, filename);

    return avatarDto;
  }

  async downloadAvatar(id: number): Promise<AvatarDto> {
    const avatarFilename = await this.userRepository.downloadAvatar(id);

    if (!avatarFilename) {
      throw new RpcException({
        message: `No avatars to download`,
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }

    const avatarDto: AvatarDto = { avatarFilename };

    return avatarDto;
  }

  async removeAvatar(id: number): Promise<AvatarDto> {
    const user = await this.userRepository.readByUniqueField({ id });

    const avatar = user.avatar;

    if (!avatar) {
      throw new RpcException({
        message: `No avatars to remove`,
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }

    await this.userRepository.removeAvatar(id);
    const avatarDto: AvatarDto = { avatarFilename: avatar };

    return avatarDto;
  }
}
