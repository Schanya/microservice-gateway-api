import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtPayloadDto, PrismaService, TransactionClient } from '@app/common';
import { RpcException } from '@nestjs/microservices';
import { compareSync, hash } from 'bcryptjs';

import { CreateUserDto, User } from '../user/dto';
import { FrontendJwt } from './types/jwt-frontend';

import { GoogleUserDto, ValidateUserDto } from './dto';

import { UserService } from '../user/user.service';
import { JwtService } from '../jwt/jwt.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async registration(
    createUserDto: CreateUserDto,
    transaction?: TransactionClient,
  ): Promise<FrontendJwt> {
    const transactionResult = await this.prisma.$transaction(
      async (transaction: TransactionClient) => {
        const registratedUser = await this.createLocalUser(
          createUserDto,
          transaction,
        );

        const { id, role } = registratedUser;
        const tokens = await this.loginUser(id, role, transaction);

        return tokens;
      },
    );

    return transactionResult;
  }

  async localLogin(user: JwtPayloadDto): Promise<FrontendJwt> {
    const { id, role } = user;
    const tokens = await this.loginUser(id, role);
    return tokens;
  }

  private async createLocalUser(
    createUserDto: CreateUserDto,
    transaction?: TransactionClient,
  ): Promise<User> {
    const hashPassword = await hash(createUserDto.password, 10);

    const user = { ...createUserDto, password: hashPassword };

    const registratedUser = await this.userService.create(user, transaction);

    return registratedUser;
  }

  private async loginUser(
    id: number,
    role: string,
    transaction?: TransactionClient,
  ): Promise<FrontendJwt> {
    const payload = { id, role };

    const accessToken = await this.jwtService.generateAccessJwt(payload);
    const refreshToken = await this.jwtService.generateRefreshJwt(payload);

    await this.jwtService.saveJwt(id, refreshToken, transaction);

    return { accessToken, refreshToken };
  }

  async logout(jwtPayload: JwtPayloadDto, refreshToken: string): Promise<void> {
    await this.jwtService.deleteJwt(jwtPayload.id, refreshToken);
  }

  async refresh(
    jwtPayload: JwtPayloadDto,
    refreshToken: string,
    transaction?: TransactionClient,
  ): Promise<FrontendJwt> {
    const transactionResult = await this.prisma.$transaction(
      async (transaction: TransactionClient) => {
        const { id, role } = jwtPayload;
        const token = await this.jwtService.getJwt(id, refreshToken);

        if (!token) {
          await this.jwtService.deleteAllJwt(id, transaction);

          throw new RpcException({
            message: 'Unauthorized user',
            statusCode: HttpStatus.UNAUTHORIZED,
          });
        }

        const isValidToken = await this.jwtService.isValidRefreshJwt(token);

        if (!isValidToken) {
          await this.jwtService.deleteJwt(id, refreshToken, transaction);
          throw new RpcException({
            message: 'Unauthorized user',
            statusCode: HttpStatus.UNAUTHORIZED,
          });
        }

        await this.jwtService.deleteJwt(id, refreshToken, transaction);

        const tokens = await this.loginUser(id, role, transaction);

        return tokens;
      },
    );

    return transactionResult;
  }

  async googleLogin(
    googleUser: GoogleUserDto,
    transaction?: TransactionClient,
  ) {
    const transactionResult = await this.prisma.$transaction(
      async (transaction: TransactionClient) => {
        const { email } = googleUser;

        let user = await this.userService.readByUniqueField({ email });

        if (!user) {
          user = await this.createGoogleUser(googleUser, transaction);
        }

        const { id, role } = user;
        const tokens = await this.loginUser(id, role, transaction);

        return tokens;
      },
    );

    return transactionResult;
  }

  private async createGoogleUser(
    googleUser: GoogleUserDto,
    transaction?: TransactionClient,
  ): Promise<User> {
    const { firstName, email } = googleUser;

    const user: CreateUserDto = {
      login: firstName,
      email,
      password: null,
      provider: 'GOOGLE',
    };

    const registratedUser = await this.userService.create(user, transaction);
    return registratedUser;
  }

  async validateUser(validateUserDto: ValidateUserDto): Promise<JwtPayloadDto> {
    const candidate = await this.userService.readByUniqueField({
      email: validateUserDto.email,
    });

    if (
      candidate &&
      compareSync(validateUserDto.password, candidate.password)
    ) {
      const { id, role } = candidate;

      return { id, role };
    }

    throw new RpcException('Uncorrect email or password');
  }
}
