import {
  ContainsMeetupDto,
  ContainsTagsInMeetupDto,
} from './contains-meetup-filter.dto';
import { GeolocationDto } from './geolocation.dto';

export class FilterMeetupDto {
  containsMeetupFilter?: ContainsMeetupDto;
  containsTagFilter?: ContainsTagsInMeetupDto;
  geolocationFilters?: GeolocationDto;
}
