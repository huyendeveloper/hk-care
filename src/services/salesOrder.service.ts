import axiosClient from 'api';
import { baseURL } from 'config';
import { FilterParams } from 'types';
import DateFns from 'utils/DateFns';

class ProductService {
  getSearchProductList({
    pageIndex,
    pageSize,
    sortBy,
    searchText,
  }: FilterParams) {
    return axiosClient.get(`${baseURL}/ProductList/SearchProductList`, {
      params: {
        Keyword: searchText,
        Sorting: sortBy,
        SkipCount: (pageIndex - 1) * pageSize,
        MaxResultCount: pageSize,
      },
    });
  }

  getAll({
    pageIndex,
    pageSize,
    searchText,
    startDate,
    lastDate,
  }: FilterParams) {
    return axiosClient.get(`${baseURL}/BillOfSale/SearchAll`, {
      params: {
        SkipCount: (pageIndex - 1) * pageSize,
        MaxResultCount: pageSize,
        Keyword: searchText,
        startDate: startDate
          ? DateFns.format(startDate, 'yyyy-MM-dd') + ' 00:00'
          : '',
        lastDate: lastDate
          ? DateFns.format(lastDate, 'yyyy-MM-dd') + ' 23:59'
          : '',
      },
    });
  }
}

export default new ProductService();
