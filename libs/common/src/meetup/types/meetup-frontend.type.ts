import { Meetup } from 'apps/meetup/src/meetup/types/meetup-entity.type';

export class MeetupFrontend {
  id: number | string;
  title: string;
  description: string;
  date: string;
  place: string;
  tags?: {
    id?: number | string;
    title?: string;
  }[];

  constructor(meetup: Meetup) {
    this.id = meetup?.id;
    this.title = meetup?.title;
    this.description = meetup?.description;
    this.date = meetup?.date;
    this.place = meetup?.place;
    //     this.organiserId = meetup?.organizerId;
    this.tags = meetup?.tags?.map((obj) => ({
      id: obj.tag.id,
      title: obj.tag.title,
    }));
  }
}
