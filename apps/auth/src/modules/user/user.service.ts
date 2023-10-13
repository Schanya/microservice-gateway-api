import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

import { AvatarDto, ReadAllResult } from '@app/common';
import { JwtService } from '../jwt/jwt.service';
import { CreateUserDto, FindUserDto, UpdateUserDto, User } from './dto';
import { FrontendUser, IReadAllUserOptions } from './types';
import { UserRepository } from './user.repository';

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

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    await this._doesUserExist({ id });

    const sameUser = await this.readByUniqueField({
      email: updateUserDto.email,
    });

    if (sameUser) {
      throw new BadRequestException('Such user already exists');
    }

    const updatedUser = await this.userRepository.update(id, updateUserDto);

    return updatedUser;
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
    const { avatar } = await this.userRepository.readByUniqueField({ id });
    const avatarDto: AvatarDto = { avatarFilename: filename };

    if (avatar) {
      avatarDto.hasOldAvatar = true;
      avatarDto.oldAvatarFilename = avatar;
    }

    await this.userRepository.update(id, { avatar: filename });

    return avatarDto;
  }

  async downloadAvatar(id: number): Promise<AvatarDto> {
    const avatar = await this._getAvatarIfExist({ id });

    const avatarDto: AvatarDto = { avatarFilename: avatar };

    return avatarDto;
  }

  async removeAvatar(id: number): Promise<AvatarDto> {
    const avatar = await this._getAvatarIfExist({ id });

    await this.userRepository.update(id, { avatar: null });
    const avatarDto: AvatarDto = { avatarFilename: avatar };

    return avatarDto;
  }

  private async _getAvatarIfExist(options: FindUserDto): Promise<string> {
    const { avatar } = await this.userRepository.readByUniqueField(options);

    if (!avatar) {
      throw new RpcException({
        message: `The specified user doesn't have any avatar`,
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }

    return avatar;
  }
}
