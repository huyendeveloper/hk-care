export interface CommonResponse<D = any> {
  data: D | null;
  httpStatusCode: number;
  success: boolean;
  total: number;
}
export interface FilterParams {
  pageIndex: number;
  pageSize: number;
  sortBy: string;
  sortDirection: Order;
  searchText: string;
}
export interface Dictionary<T = any> {
  [key: string]: T;
}

export type Order = 'asc' | 'desc' | '';

export type Role = 'admin' | 'user';
