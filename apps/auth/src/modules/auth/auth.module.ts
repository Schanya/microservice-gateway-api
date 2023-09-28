import { DatabaseModule } from '@app/common';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

import { UserModule } from '../user/user.module';
import { JwtModule } from '../jwt/jwt.module';
import { envSchemaOptions } from 'apps/auth/common/configs/env-schema.config';

@Module({
  imports: [
    ConfigModule.forRoot(envSchemaOptions),
    DatabaseModule,
    UserModule,
    JwtModule,
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
