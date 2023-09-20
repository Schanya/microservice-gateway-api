import { Tag } from './tag-entity.type';

export class Meetup {
  id: number | string;
  title: string;
  description: string;
  date: string;
  place: string;
  tags?: { tag: Tag }[];
}
