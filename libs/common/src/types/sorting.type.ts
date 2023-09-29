export type SortingDirection = 'DESC' | 'ASC';

export interface ISortingOptions {
  column: string;
  direction: SortingDirection;
}

export type Sorting = {
  order: Record<string, SortingDirection>;
};
