import axiosClient from 'api';
import { baseURL } from 'config';
import { IProductGroup } from 'interface';
import { FilterParams } from 'types';

class ProductGroupService {
  getAll({ pageIndex, pageSize, sortBy, searchText }: FilterParams) {
    return axiosClient.post(`${baseURL}/app/product-group/search-all`, {
      maxResultCount: pageSize,
      skipCount: (pageIndex - 1) * pageSize,
      sorting: sortBy,
      keyword: searchText,
    });
  }

  get(id: number) {
    return axiosClient.get(`${baseURL}/app/product-group/${id}`);
  }

  create(payload: IProductGroup) {
    return axiosClient.post(`${baseURL}/app/product-group`, payload);
  }

  update({ id, ...payload }: IProductGroup) {
    return axiosClient.put(`${baseURL}/app/product-group/${id}`, payload);
  }

  delete(id: number | null) {
    return axiosClient.delete(`${baseURL}/app/product-group/${id}`);
  }
}

export default new ProductGroupService();
