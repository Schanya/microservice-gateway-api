import { IPaginationOptions, ISortingOptions } from '@app/common';

export interface IReadAllMeetupOptions {
  filters?: {
    title?: string;
    description?: string;
    date?: string;
    place?: string;
    latitude?: number;
    longitude?: number;
    tags?: string[];
    organizerId?: number;
  };
  pagination?: IPaginationOptions;
  sorting?: ISortingOptions;
}
