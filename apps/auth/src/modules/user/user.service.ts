import { HttpStatus, Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { CreateUserDto, User } from './dto';
import { FindUserDto } from './dto/find-user.dto';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = await this.userRepository.create(createUserDto);

    return createdUser;
  }

  async readBy(options: FindUserDto): Promise<User> {
    const user = await this.userRepository.readBy(options);

    return user;
  }

  async delete(id: number): Promise<void> {
    this._doesUserExist(id);

    await this.userRepository.delete(id);
  }

  private async _doesUserExist(id: number): Promise<void> {
    const existingUser = await this.userRepository.readBy({ id });
    if (!existingUser) {
      throw new RpcException({
        message: `The specified user does not exist`,
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }
  }
}
