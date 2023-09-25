import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get(':name')
  @HttpCode(HttpStatus.OK)
  async readById(@Param('name') name: string): Promise<string> {
    const greetings = await this.authService.test(name);

    return greetings;
  }
}
