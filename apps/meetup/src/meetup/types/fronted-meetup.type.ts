import { Meetup } from '../dto';

export class FrontendMeetup {
  id: number;
  title: string;
  description: string;
  date: string;
  place: string;
  organizerId: number;
  latitude: number;
  longitude: number;
  tags?: {
    id?: number;
    title?: string;
  }[];
  members?: {
    id?: number;
    email?: string;
  }[];

  constructor(meetup: Meetup) {
    this.id = meetup?.id;
    this.title = meetup?.title;
    this.description = meetup?.description;
    this.date = meetup?.date;
    this.place = meetup?.place;
    this.organizerId = meetup?.organizerId;
    this.latitude = meetup?.latitude;
    this.longitude = meetup?.longitude;
    this.tags = meetup?.tags?.map((obj) => ({
      id: obj.tag.id,
      title: obj.tag.title,
    }));
    this.members = meetup?.members?.map((member) => ({
      id: member.user.id,
      email: member.user.email,
    }));
  }
}
