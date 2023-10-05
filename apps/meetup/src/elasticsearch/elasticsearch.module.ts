import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { MeetupEsService } from './meetup-elasticsearch.service';

const DefineEsModule = ElasticsearchModule.registerAsync({
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => ({
    node: configService.get('ELASTICSEARCH_NODE'),
    auth: {
      username: configService.get('ELASTICSEARCH_USERNAME'),
      password: configService.get('ELASTICSEARCH_PASSWORD'),
    },
  }),
  inject: [ConfigService],
});

@Module({
  imports: [DefineEsModule],
  providers: [MeetupEsService],
  exports: [MeetupEsService],
})
export class EsModule implements OnModuleInit {
  constructor(private readonly meetupEsService: MeetupEsService) {}

  async onModuleInit(): Promise<void> {
    await this.meetupEsService.createIndex();
  }
}
