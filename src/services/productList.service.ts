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

  delete(id: number | null) {
    return axiosClient.post(`${baseURL}/ProductList/UnRegisterProduct`, null, {
      params: {
        productId: id,
      },
    });
  }

  changeStatus(id: number | null, status: boolean) {
    return axiosClient.patch(`${baseURL}/product/ChangeStatus/${id}`, null, {
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

  updateNorm(productListId: number, norm: number) {
    return axiosClient.put(`${baseURL}/ProductList/UpdateNorm`, null, {
      params: {
        productListId,
        norm,
      },
    });
  }
}

export default new ProductService();
