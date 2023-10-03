import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import MeetupElasticsearchService from './meetup-elasticsearch.service';

const DefineElasticsearchModule = ElasticsearchModule.registerAsync({
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
  imports: [DefineElasticsearchModule],
  providers: [MeetupElasticsearchService],
  exports: [MeetupElasticsearchService],
})
export class SearchModule implements OnModuleInit {
  constructor(
    private readonly meetupSearchService: MeetupElasticsearchService,
  ) {}
  public async onModuleInit() {
    await this.meetupSearchService.createIndex();
  }
}
