import { Tag } from '../../tag/dto';

export class Meetup {
  id: number | string;
  title: string;
  description: string;
  date: string;
  place: string;
  tags?: { tag: Tag }[];
}
