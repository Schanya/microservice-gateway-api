import { DatabaseModule } from '@app/common';
import { Module } from '@nestjs/common';

import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { UserController } from './user.controller';
import { JwtModule } from '../jwt/jwt.module';

@Module({
  imports: [DatabaseModule, JwtModule],
  providers: [UserRepository, UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
