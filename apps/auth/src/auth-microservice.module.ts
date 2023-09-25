import { RmqModule } from '@app/common';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { envSchemaOptions } from '../common/configs/env-schema.config';
import { AuthModule } from './modules/auth/auth.module';
import { MicroserviceAllExceptionsFilter } from '@app/common';
import { APP_FILTER } from '@nestjs/core';

@Module({
  imports: [ConfigModule.forRoot(envSchemaOptions), RmqModule, AuthModule],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: MicroserviceAllExceptionsFilter,
    },
  ],
})
export class AuthMicroserviceModule {}
