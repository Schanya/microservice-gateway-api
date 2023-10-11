import { BaseReadAllDto } from '@app/common';
import { GeolocationDto } from './geolocation.dto';

export class ReadAllMeetupDto extends BaseReadAllDto {
  title?: string;
  description?: string;
  date?: string;
  place?: string;
  geolocation: GeolocationDto;
  tags?: string[];
}
