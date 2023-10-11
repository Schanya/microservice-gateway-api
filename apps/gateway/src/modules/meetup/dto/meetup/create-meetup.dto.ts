import { CreateTagDto } from '../tag/create-tag.dto';

export class CreateMeetupDto {
  title: string;
  description: string;
  date: string;
  place: string;
  latitude: number;
  longitude: number;
  tags?: CreateTagDto[];
}
