import { RmqModule } from '@app/common';
import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    RmqModule.register({
      name: 'AUTH',
    }),
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [],
})
export class UserModule {}
