import { defaultPagination } from '../constants/pagination.constant';

export class PaginationDto {
  page: number = defaultPagination.page;
  size: number = defaultPagination.size;

  get offset(): number {
    return (this.page - 1) * this.size;
  }
}
