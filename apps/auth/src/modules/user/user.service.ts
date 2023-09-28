import { HttpStatus, Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

import { UserRepository } from './user.repository';
import { CreateUserDto, FindUserDto, User } from './dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    if (this._doesUserExist({ email: createUserDto.email })) {
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
    this._doesUserExist({ id });

    await this.userRepository.delete(id);
  }

  private async _doesUserExist(options: FindUserDto): Promise<boolean> {
    const existingUser = await this.userRepository.readByUniqueField(options);
    if (!existingUser) {
      throw new RpcException({
        message: `The specified user does not exist`,
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }

    return true;
  }
}
