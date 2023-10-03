import { RmqModule } from '@app/common';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

import { JwtStrategy, LocalStrategy, RefreshStrategy } from './strategies';

@Module({
  imports: [
    RmqModule.register({
      name: 'AUTH',
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, RefreshStrategy],
  exports: [AuthService],
})
export class AuthModule {}
