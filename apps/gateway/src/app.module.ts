import { Module } from '@nestjs/common';
import { MeetupModule } from './modules/meetup/meetup.module';
import { ConfigModule } from '@nestjs/config';
import { envValidationSchema } from './common/schemas/env-validation.schema';
import { AllExceptionsFilter } from '@app/common';
import { APP_FILTER } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: envValidationSchema,
      envFilePath: './apps/gateway/.env',
    }),
    MeetupModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
