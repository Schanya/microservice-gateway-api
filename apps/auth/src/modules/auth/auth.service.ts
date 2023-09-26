import { Injectable } from '@nestjs/common';
import { CreateUserDto, User } from '../user/dto';
import { FrontendJwt } from './types/jwt-frontend';
import { PrismaService } from '@app/common';
import { UserService } from '../user/user.service';
import { JwtPayloadDto } from './dto/jwt-payload.dto';
import { hash } from 'bcryptjs';
import { JwtService } from '../jwt/jwt.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async registration(createUserDto: CreateUserDto): Promise<FrontendJwt> {
    const registratedUser = await this.createLocalUser(createUserDto);

    const { id, role } = registratedUser;
    const tokens = await this.loginUser(id, role);

    return tokens;
  }

  async localLogin(user: JwtPayloadDto): Promise<FrontendJwt> {
    const { id, role } = user;
    const tokens = await this.loginUser(id, role);
    return tokens;
  }

  private async createLocalUser(createUserDto: CreateUserDto): Promise<User> {
    const hashPassword = await hash(createUserDto.password, 10);

    const user = { ...createUserDto, password: hashPassword };

    const registratedUser = await this.userService.create(user);

    return registratedUser;
  }

  private async loginUser(id: number, role: string): Promise<FrontendJwt> {
    const payload = { id, role };

    const accessToken = await this.jwtService.generateAccessJwt(payload);
    const refreshToken = await this.jwtService.generateRefreshJwt(payload);

    return { accessToken, refreshToken };
  }
}
