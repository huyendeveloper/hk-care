import axiosClient from 'api';
import { baseURL } from 'config';
import { FilterParams } from 'types';

class ProductService {
  getAll({ pageIndex, pageSize, sortBy, searchText }: FilterParams) {
    return axiosClient.get(
      `${baseURL}/ProductList/SearchRegisterProduct?Keyword=${searchText}&SkipCount=${
        (pageIndex - 1) * pageSize
      }&MaxResultCount=${pageSize}`
    );
    // return axiosClient.post(`${baseURL}/ProductList/SearchRegisterProduct`, {
    //   maxResultCount: pageSize,
    //   skipCount: (pageIndex - 1) * pageSize,
    //   sorting: '',
    //   keyword: 'searchText',
    //   descending: false,
    // });
  }

  getAllProduct({ pageIndex, pageSize, sortBy, searchText }: FilterParams) {
    return axiosClient.get(
      `${baseURL}/ProductList/SearchAll?Keyword=${searchText}&SkipCount=${
        (pageIndex - 1) * pageSize
      }&MaxResultCount=${pageSize}`
    );
    // return axiosClient.post(`${baseURL}/ProductList/SearchAll`, {
    //   maxResultCount: pageSize,
    //   skipCount: (pageIndex - 1) * pageSize,
    //   sorting: '',
    //   keyword: 'searchText',
    //   descending: false,
    // });
  }

  getAllProductRegisted({
    pageIndex,
    pageSize,
    sortBy,
    searchText,
  }: FilterParams) {
    return axiosClient.get(
      `${baseURL}/ProductList/SearchRegisterProductList?Keyword=${searchText}&SkipCount=${
        (pageIndex - 1) * pageSize
      }&MaxResultCount=${pageSize}`
    );

    // return axiosClient.post(
    //   `${baseURL}/ProductList/SearchRegisterProductList`,
    //   {
    //     maxResultCount: pageSize,
    //     skipCount: (pageIndex - 1) * pageSize,
    //     sorting: '',
    //     keyword: 'searchText',
    //     descending: false,
    //   }
    // );
  }

  get(id: number) {
    return axiosClient.get(
      `${baseURL}/ProductList/GetProductListDetail?productId=${id}`
    );
  }

  create(payload: { listProductId: number[] }) {
    return axiosClient.post(
      `${baseURL}/ProductList/RegisterProducts`,
      payload.listProductId
    );
  }

  update(payload: { price: number; productId: number }) {
    return axiosClient.put(
      `${baseURL}/ProductList/UpdatePrice?productId=${payload.productId}&price=${payload.price}`
    );
  }

  delete(id: number | null) {
    return axiosClient.post(
      `${baseURL}/ProductList/UnRegisterProduct?productId=${id}`
    );
  }

  changeStatus(id: number | null, status: boolean) {
    return axiosClient.patch(
      `${baseURL}/product/ChangeStatus/${id}?status=${status}`
    );
  }

  getFile(filePath: string) {
    return axiosClient.get(`${baseURL}/file/url-file?filePath=${filePath}`);
  }
}

export default new ProductService();
