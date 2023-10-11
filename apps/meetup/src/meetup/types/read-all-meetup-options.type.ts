import { IPaginationOptions, ISortingOptions } from '@app/common';
import { GeolocationDto } from '../dto';

export interface IReadAllMeetupOptions {
  filters?: {
    title?: string;
    description?: string;
    date?: string;
    place?: string;
    tags?: string[];
    organizerId?: number;
    geolocation?: GeolocationDto;
  };

  pagination?: IPaginationOptions;
  sorting?: ISortingOptions;
}
