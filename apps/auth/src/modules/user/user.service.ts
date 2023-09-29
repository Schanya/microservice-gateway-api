import { HttpStatus, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

import { UserRepository } from './user.repository';
import { CreateUserDto, FindUserDto, User } from './dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

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
}
