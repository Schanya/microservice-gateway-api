import { Module } from '@nestjs/common';
import { DatabaseModule } from '@app/common';

import { TagRepository } from './tag.repository';
import { TagService } from './tag.service';

@Module({
  imports: [DatabaseModule],
  providers: [TagRepository, TagService],
  exports: [TagRepository, TagService],
})
export class TagModule {}
