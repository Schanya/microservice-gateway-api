export type SortingDirection = 'desc' | 'asc';

export interface ISortingOptions {
  column: string;
  direction: SortingDirection;
}

export type Sorting = {
  order: Record<string, SortingDirection>;
};
