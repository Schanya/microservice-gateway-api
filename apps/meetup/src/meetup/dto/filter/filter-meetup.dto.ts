import {
  ContainsMeetupDto,
  ContainsTagsInMeetupDto,
} from './contains-meetup-filter.dto';

export class FilterMeetupDto {
  containsMeetupFilter?: ContainsMeetupDto;
  containsTagFilter?: ContainsTagsInMeetupDto;
}
