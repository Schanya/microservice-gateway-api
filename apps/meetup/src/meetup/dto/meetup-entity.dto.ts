import { Tag } from '../../tag/dto';

export class Meetup {
  id: number;
  title: string;
  description: string;
  date: string;
  place: string;
  organizerId: number;
  latitude: number;
  longitude: number;
  tags?: { tag: Tag }[];
  members?: { user: { id: number; email: string } }[];
}
