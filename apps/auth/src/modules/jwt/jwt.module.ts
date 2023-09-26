import { Module } from '@nestjs/common';
import { JwtModule as NestJwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { JwtRepository } from './jwt.repository';
import { JwtService } from './jwt.service';
import { DatabaseModule } from '@app/common';
import { envSchemaOptions } from 'apps/auth/common/configs/env-schema.config';

const DefineNestJwtModule = NestJwtModule.registerAsync({
  useFactory: async (configServie: ConfigService) => ({
    secret: configServie.get<string>('ACCESS_TOKEN_SECRET'),
    signOptions: {
      expiresIn: configServie.get<string>('ACCESS_TOKEN_EXPIRED'),
    },
  }),
  inject: [ConfigService],
});

@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot(envSchemaOptions),
    DefineNestJwtModule,
  ],
  providers: [JwtRepository, JwtService],
  exports: [JwtService],
})
export class JwtModule {}
