import { Tag } from '../tag/tag-entity.dto';

export class Meetup {
  id: number;
  title: string;
  description: string;
  date: string;
  place: string;
  latitude: number;
  longitude: number;
  tags?: { tag: Tag }[];
}
