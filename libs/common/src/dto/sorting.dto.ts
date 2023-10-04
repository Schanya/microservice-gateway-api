import { defaultSorting } from '../constants/sorting.constant';

export class SortingDto {
  column: string = defaultSorting.column;

  direction: 'desc' | 'asc' = defaultSorting.direction;
}
