import { MeetupSearchBody } from './elasticsearch-meetup.body.type';

export interface MeetupSearchResult {
  hits: {
    total: number;
    hits: Array<{ _source: MeetupSearchBody }>;
  };
}
