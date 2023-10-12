import { RmqModule } from '@app/common';
import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AwsModule } from '../aws/aws.module';
import { ConfigService } from '@nestjs/config';
import { AwsOptions } from '../aws/types';

const DefineAwsModule = AwsModule.registerAsync({
  useFactory: (configService: ConfigService): AwsOptions => ({
    accessKeyId: configService.get<string>('AWS_ACCESS_KEY_ID'),
    secretAccessKey: configService.get<string>('AWS_SECRET_ACCESS_KEY'),
    Bucket: configService.get<string>('AWS_BUCKET_NAME'),
    debug: false,
    route: configService.get<string>('AWS_ROUTE_NAME'),
  }),
  inject: [ConfigService],
});

@Module({
  imports: [
    RmqModule.register({
      name: 'AUTH',
    }),
    DefineAwsModule,
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [],
})
export class UserModule {}
