import axiosClient from 'api';
import { baseURL } from 'config';
import { FilterParams } from 'types';

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
}

export default new ProductService();
