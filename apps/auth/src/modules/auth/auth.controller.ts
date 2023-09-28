import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto';
import { FrontendJwt } from './types/jwt-frontend';
import { JwtPayloadDto } from './dto/jwt-payload.dto';

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

  @MessagePattern('AUTH_USER_VALIDATE')
  public async validateUser(
    @Payload('email') email: string,
    @Payload('password') password: string,
  ): Promise<JwtPayloadDto> {
    const validate = await this.authService.validateUser({ email, password });
    return validate;
  }
}
