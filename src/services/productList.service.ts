import axiosClient from 'api';
import { baseURL } from 'config';
import { FilterParams } from 'types';

class ProductService {
  getAll({ pageIndex, pageSize, sortBy, searchText }: FilterParams) {
    return axiosClient.get(`${baseURL}/ProductList/SearchRegisterProduct`, {
      params: {
        Keyword: searchText,
        Sorting: sortBy,
        SkipCount: (pageIndex - 1) * pageSize,
        MaxResultCount: pageSize,
      },
    });
  }

  getAllProduct({ pageIndex, pageSize, sortBy, searchText }: FilterParams) {
    return axiosClient.get(`${baseURL}/ProductList/SearchAll`, {
      params: {
        Keyword: searchText,
        Sorting: sortBy,
        SkipCount: (pageIndex - 1) * pageSize,
        MaxResultCount: pageSize,
      },
    });
  }

  getAllProductRegisted({
    pageIndex,
    pageSize,
    sortBy,
    searchText,
  }: FilterParams) {
    return axiosClient.get(`${baseURL}/ProductList/SearchRegisterProductList`, {
      params: {
        Keyword: searchText,
        Sorting: sortBy,
        SkipCount: (pageIndex - 1) * pageSize,
        MaxResultCount: pageSize,
      },
    });
  }

  get(id: number) {
    return axiosClient.get(`${baseURL}/ProductList/GetProductListDetail`, {
      params: {
        productId: id,
      },
    });
  }

  create(payload: { listProductId: number[] }) {
    return axiosClient.post(
      `${baseURL}/ProductList/RegisterProducts`,
      payload.listProductId
    );
  }

  update(payload: { price: number; productId: number }) {
    return axiosClient.put(`${baseURL}/ProductList/UpdatePrice`, {
      params: {
        productId: payload.productId,
        price: payload.price,
      },
    });
  }

  delete(id: number | null) {
    return axiosClient.post(`${baseURL}/ProductList/UnRegisterProduct`, {
      params: {
        productId: id,
      },
    });
  }

  changeStatus(id: number | null, status: boolean) {
    return axiosClient.patch(`${baseURL}/product/ChangeStatus/${id}`, {
      params: {
        status,
      },
    });
  }

  getFile(filePath: string) {
    return axiosClient.get(`${baseURL}/file/url-file`, {
      params: {
        filePath,
      },
    });
  }
}

export default new ProductService();
