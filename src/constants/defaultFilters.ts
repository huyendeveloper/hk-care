import { FilterParams } from 'types';

export const defaultFilters: FilterParams = {
  pageIndex: 1,
  pageSize: 10,
  sortBy: '',
  sortDirection: 'desc',
  searchText: '',
  startDate: null,
  lastDate: null,
};
