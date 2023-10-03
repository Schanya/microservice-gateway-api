import { RmqModule } from '@app/common';
import { Module } from '@nestjs/common';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

import { JwtStrategy, LocalStrategy, RefreshStrategy } from './strategies';
import { GoogleStrategy } from './strategies/google.strategy';

@Module({
  imports: [
    RmqModule.register({
      name: 'AUTH',
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    RefreshStrategy,
    GoogleStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}
