import { Module } from '@nestjs/common';
import { MeetupModule } from './modules/meetup/meetup.module';
import { ConfigModule } from '@nestjs/config';
import { envValidationSchema } from './common/schemas/env-validation.schema';

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
  providers: [],
})
export class AppModule {}
