import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';

import { AuthService } from './auth.service';
import { CreateUserDto, User } from './dto';
import { CreateUserSchema } from './schemas';

import { UserParam } from '@gateway/common/decorators';
import { JoiValidationPipe } from '@gateway/common/pipes';
import { LocalAuthGuard } from '@gateway/common/guards';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('registration')
  @HttpCode(HttpStatus.OK)
  public async register(
    @Body(new JoiValidationPipe(CreateUserSchema))
    createUserDto: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    const tokens = await this.authService.register(createUserDto);

    res.cookie('auth-cookie', tokens, { httpOnly: true, sameSite: true });
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  public async localLogin(
    @UserParam() user: User,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    const secretData = await this.authService.login(user);

    res.cookie('auth-cookie', secretData, { httpOnly: true, sameSite: true });
  }
}
