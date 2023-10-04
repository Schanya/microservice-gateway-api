export interface IPaginationOptions {
  page: number;
  size: number;

  get offset(): number;
}
