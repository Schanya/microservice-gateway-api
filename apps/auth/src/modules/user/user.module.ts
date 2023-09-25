import { DatabaseModule } from '@app/common';
import { Module } from '@nestjs/common';

@Module({
  imports: [DatabaseModule],
  providers: [],
  controllers: [],
  exports: [],
})
export class UserModule {}
