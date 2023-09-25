import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern('AUTH_TEST')
  async create(@Payload('name') name: string): Promise<string> {
    const greetings = await this.authService.test(name);

    return greetings;
  }
}
