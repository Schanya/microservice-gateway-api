import { CreateTagDto } from '../../tag/dto';

export class CreateMeetupDto {
  title: string;
  description: string;
  date: string;
  place: string;
  tags?: string[];
}
