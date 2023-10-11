import {
  ContainsMeetupDto,
  ContainsTagsInMeetupDto,
  FilterMeetupDto,
  ReadAllMeetupDto,
  GeolocationDto,
} from '../dto';

export class MeetupFiltration {
  static whereFilter = (filterOptions: ReadAllMeetupDto): FilterMeetupDto => {
    const meetupFilters: ContainsMeetupDto = {};
    const tagFilters: ContainsTagsInMeetupDto = {};
    let geolocationFilters: GeolocationDto = {};

    for (let [key, value] of Object.entries(filterOptions)) {
      if (key == 'tags') {
        const tagsOptions = value.map((el: string) => {
          return { tag: { title: { contains: el } } };
        });

        tagFilters[key] = { some: { OR: tagsOptions } };

        continue;
      }

      if (key == 'geolocation') {
        geolocationFilters = value;

        continue;
      }

      meetupFilters[key] = { contains: value };
    }

    return {
      containsMeetupFilter: meetupFilters,
      containsTagFilter: tagFilters,
      geolocationFilters,
    };
  };
}
