import { GeolocationDto } from './filter/geolocation.dto';

export class ReadAllMeetupDto {
  title?: string;
  description?: string;
  date?: string;
  place?: string;
  geolocation?: GeolocationDto;
  tags?: string[];
}
