import { Tag } from '../../tag/dto';

export class Meetup {
  id: number;
  title: string;
  description: string;
  date: string;
  place: string;
  tags?: { tag: Tag }[];
}
