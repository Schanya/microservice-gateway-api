import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { Meetup } from '../meetup/dto';
import { FrontendMeetup } from '../meetup/types';
import { MeetupSearchBody, MeetupSearchResult } from './types';

@Injectable()
export class MeetupEsService {
  private index = 'meetup';
  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  async createIndex() {
    try {
      const checkIndex = await this.elasticsearchService.indices.exists({
        index: this.index,
      });

      if (!checkIndex) {
        this.elasticsearchService.indices.create({ index: this.index });
      }
    } catch (err) {
      console.error('ELASTIC ERROR: ' + err);
      throw err;
    }
  }

  async create(meetupEntity: Meetup): Promise<void> {
    const meetup = new FrontendMeetup(meetupEntity);
    const { tags, ...rest } = meetupEntity;

    await this.elasticsearchService.index<MeetupSearchBody>({
      index: this.index,
      document: {
        ...rest,
        tags: meetup.tags.map((tag) => ({ id: tag.id, title: tag.title })),
      },
    });
  }

  async search(searchText: string): Promise<MeetupSearchResult> {
    const data = await this.elasticsearchService.search<
      MeetupSearchBody,
      MeetupSearchResult
    >({
      index: this.index,
      body: {
        query: {
          multi_match: {
            query: searchText,
            fuzziness: 'auto',
          },
        },
      },
    });

    const result: MeetupSearchResult = {
      hits: {
        total: data.hits.hits.length,
        hits: data.hits.hits.map((hit) => ({ _source: hit._source })),
      },
    };

    return result;
  }

  async update(meetupEntity: Meetup): Promise<void> {
    const meetup = new FrontendMeetup(meetupEntity);

    const document = await this.elasticsearchService.search({
      index: this.index,
      body: {
        query: {
          match: {
            id: meetup.id,
          },
        },
      },
    });

    const documentId = document.hits.hits[0]._id;
    const { tags, ...rest } = meetupEntity;

    await this.elasticsearchService.update({
      index: this.index,
      id: documentId,
      doc: {
        ...rest,
        tags: meetup.tags.map((tag) => ({ id: tag.id, title: tag.title })),
      },
    });
  }

  async delete(id: number): Promise<void> {
    await this.elasticsearchService.deleteByQuery({
      index: this.index,
      body: {
        query: {
          match: {
            id: id,
          },
        },
      },
    });
  }
}
