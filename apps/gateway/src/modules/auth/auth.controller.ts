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
import { JoiValidationPipe } from '../../common/pipes/joi-validation.pipe';
import { AuthService } from './auth.service';
import { CreateUserDto, User } from './dto';
import { CreateUserSchema } from './schemas/create-user.schema';
import { LocalAuthGuard } from '../../common/guards';
import { UserParam } from '../../common/decorators';
import { FrontendJwt } from './types';

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
  ): Promise<FrontendJwt> {
    const secretData = await this.authService.login(user);

    this.setAuthCookie(res, secretData);

    return secretData;
  }

  private setAuthCookie(res: Response, cookie: any): void {
    res.cookie('auth-cookie', cookie, { httpOnly: true, sameSite: true });
  }
}
