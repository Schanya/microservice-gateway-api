import { PaginationDto } from './pagination.dto';
import { SortingDto } from './sorting.dto';

export class BaseReadAllDto {
  pagination: PaginationDto;
  sorting: SortingDto;
}
