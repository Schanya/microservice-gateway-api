import { CreateTagDto } from '../../tag/dto';

export class UpdateMeetupDto {
  title?: string;
  description?: string;
  date?: string;
  place?: string;
  tags?: CreateTagDto[];
}
