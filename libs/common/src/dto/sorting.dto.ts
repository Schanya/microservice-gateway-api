import { defaultSorting } from '../constants/sorting.constant';

export class SortingDto {
  column: string = defaultSorting.column;

  direction: 'DESC' | 'ASC' = defaultSorting.direction;
}
