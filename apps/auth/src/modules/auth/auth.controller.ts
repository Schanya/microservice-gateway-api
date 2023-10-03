import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { JwtPayloadDto } from '@app/common';

import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto';
import { FrontendJwt } from './types/jwt-frontend';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern('AUTH_REGISTRATION')
  public async registration(
    @Payload('createUserDto') createUserDto: CreateUserDto,
  ): Promise<FrontendJwt> {
    const tokens = await this.authService.registration(createUserDto);

    return new FrontendJwt(tokens.accessToken, tokens.refreshToken);
  }

  @MessagePattern('AUTH_LOCAL_LOGIN')
  public async localLogin(
    @Payload('user') user: JwtPayloadDto,
  ): Promise<FrontendJwt> {
    const tokens = await this.authService.localLogin(user);

    return new FrontendJwt(tokens.accessToken, tokens.refreshToken);
  }

  @MessagePattern('AUTH_LOGOUT')
  public async logout(
    @Payload('jwtPayload') jwtPayload: JwtPayloadDto,
    @Payload('refreshToken') refreshToken: string,
  ): Promise<void> {
    await this.authService.logout(jwtPayload, refreshToken);
  }

  @MessagePattern('AUTH_REFRESH')
  public async refresh(
    @Payload('jwtPayload') jwtPayload: JwtPayloadDto,
    @Payload('refreshToken') oldRefreshToken: string,
  ): Promise<FrontendJwt> {
    const { accessToken, refreshToken } = await this.authService.refresh(
      jwtPayload,
      oldRefreshToken,
    );

    return new FrontendJwt(accessToken, refreshToken);
  }

  @MessagePattern('AUTH_GOOGLE_LOGIN')
  async yandexLogin(@Payload('googleUser') googleUser: any) {
    const { accessToken, refreshToken } =
      await this.authService.googleLogin(googleUser);

    return new FrontendJwt(accessToken, refreshToken);
  }

  @MessagePattern('AUTH_USER_VALIDATE')
  public async validateUser(
    @Payload('email') email: string,
    @Payload('password') password: string,
  ): Promise<JwtPayloadDto> {
    const validate = await this.authService.validateUser({ email, password });

    return validate;
  }
}
