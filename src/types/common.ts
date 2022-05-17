export interface CommonResponse<D = any> {
  data: D | null;
  httpStatusCode: number;
  success: boolean;
  total: number;
}
export interface FilterParams {
  sortDirection: Order;
  pageIndex: number;
  pageSize: number;
  sortBy: string;
  searchText: string;
}
export interface Dictionary<T = any> {
  [key: string]: T;
}

export type Order = 'asc' | 'desc' | '';

export type Role =
  | 'hkl1'
  | 'hkl2'
  | 'hkl3'
  | 'hkl4'
  | 'hkl2_1'
  | 'hkl2_1_1'
  | 'hkl2_1_2'
  | 'hkl2_1_3'
  | 'hkl2_1_4'
  | 'empty';
