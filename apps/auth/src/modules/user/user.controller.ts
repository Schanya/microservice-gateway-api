import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { UserService } from './user.service';
import { FrontendUser } from './types';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern('USER_GET_BY')
  async readBy(@Payload('id') id: number): Promise<FrontendUser> {
    const user = await this.userService.readByUniqueField({ id });
    return new FrontendUser(user);
  }

  @MessagePattern('USER_DELETE')
  async deleteBy(@Payload('id') id: number): Promise<void> {
    await this.userService.delete(id);
  }
}
