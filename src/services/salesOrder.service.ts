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
    supplierId,
  }: FilterParams) {
    return axiosClient.get(
      `${baseURL}/ProductList/SearchProductList?Keyword=${searchText}&SkipCount=${
        (pageIndex - 1) * pageSize
      }&MaxResultCount=${pageSize}&supplierId=${supplierId}`
    );
  }

  getAll({
    pageIndex,
    pageSize,
    sortBy,
    searchText,
    startDate,
    lastDate,
  }: FilterParams) {
    return axiosClient.get(
      `${baseURL}/BillOfSale/SearchAll?Keyword=${searchText}&SkipCount=${
        (pageIndex - 1) * pageSize
      }&MaxResultCount=${pageSize}&startDate=${
        startDate ? DateFns.format(startDate, 'yyyy-MM-dd') + ' 00:00' : ''
      }&lastDate=${
        lastDate ? DateFns.format(lastDate, 'yyyy-MM-dd') + ' 23:59' : ''
      }`
    );
  }
}

export default new ProductService();
