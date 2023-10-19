import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';

import { AuthService } from './auth.service';
import { CreateUserDto, GoogleUserDto, User } from './dto';
import { CreateUserSchema, GoogleUserSchema } from './schemas';

import { JwtPayloadDto } from '@app/common';
import { GetTokens, UserParam } from '@gateway/common/decorators';
import {
  GoogleAuthGuard,
  JwtAuthGuard,
  LocalAuthGuard,
  RefreshGuard,
} from '@gateway/common/guards';
import { JoiValidationPipe } from '@gateway/common/pipes';
import { setCookie } from '@gateway/common/utils';

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
    createUserDto.provider = 'LOCAL';
    const secretData = await this.authService.register(createUserDto);

    setCookie(res, secretData);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  public async localLogin(
    @UserParam() user: User,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    user.provider = 'LOCAL';
    const secretData = await this.authService.login(user);

    setCookie(res, secretData);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  public async logout(
    @UserParam() userPayload: JwtPayloadDto,
    @GetTokens('refreshToken') token: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    await this.authService.logout(userPayload, token);

    setCookie(res, null);
  }

  @UseGuards(RefreshGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  public async refresh(
    @UserParam() userPayload: JwtPayloadDto,
    @GetTokens('refreshToken') token: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    const secretData = await this.authService.refresh(userPayload, token);

    setCookie(res, secretData);
  }

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async googleAuth() {}

  @Get('google/redirect')
  @UseGuards(GoogleAuthGuard)
  async googleAuthRedirect(
    @UserParam(new JoiValidationPipe(GoogleUserSchema))
    googleUser: GoogleUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const secretData = await this.authService.googleLogin(googleUser);

    setCookie(res, secretData);
  }
}
