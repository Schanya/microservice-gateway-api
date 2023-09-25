import { DatabaseModule } from '@app/common';
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ConfigModule } from '@nestjs/config';
import { envSchemaOptions } from 'apps/meetup/common/configs/env-schema.config';

@Module({
  imports: [ConfigModule.forRoot(envSchemaOptions), DatabaseModule],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
