import { RmqModule } from '@app/common';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

import { JwtStrategy, LocalStrategy } from './strategies';

@Module({
  imports: [
    RmqModule.register({
      name: 'AUTH',
    }),
    ConfigModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
