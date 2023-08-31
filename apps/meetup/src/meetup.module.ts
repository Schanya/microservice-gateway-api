import { Module } from '@nestjs/common';
import { MeetupController } from './meetup.controller';
import { MeetupService } from './meetup.service';
import { ConfigModule } from '@nestjs/config';
import { envValidationSchema } from '../common/schemas/env-validation.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: envValidationSchema,
      envFilePath: './apps/meetup/.env',
    }),
  ],
  controllers: [MeetupController],
  providers: [MeetupService],
})
export class MeetupModule {}
