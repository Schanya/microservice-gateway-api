import { DatabaseModule } from '@app/common';
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ConfigModule } from '@nestjs/config';
import { envSchemaOptions } from 'apps/meetup/common/configs/env-schema.config';
import { UserModule } from '../user/user.module';
import { JwtModule } from '../jwt/jwt.module';

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
