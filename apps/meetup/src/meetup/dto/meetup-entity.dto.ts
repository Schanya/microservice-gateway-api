import { Tag } from '../../tag/dto';

export class Meetup {
  id: number;
  title: string;
  description: string;
  date: string;
  place: string;
  organizerId: number;
  tags?: { tag: Tag }[];
}
