import axiosClient from 'api';
import { baseURL } from 'config';
import { IProductGroup } from 'interface';
import { FilterParams } from 'types';

class ProductGroupService {
  getAll({ pageIndex, pageSize, sortBy, searchText }: FilterParams) {
    return axiosClient.get(
      `${baseURL}/product-group/search-all?Keyword=${searchText}&Sorting=${sortBy}&SkipCount=${
        (pageIndex - 1) * pageSize
      }&MaxResultCount=${pageSize}`
    );
  }

  getAllProductGroupp() {
    return axiosClient.get(`${baseURL}/product-group/search-all`);
  }

  get(id: number) {
    return axiosClient.get(`${baseURL}/product-group/${id}`);
  }

  create(payload: IProductGroup) {
    return axiosClient.post(`${baseURL}/productgroup/Create`, payload);
  }

  update({ id, ...payload }: IProductGroup) {
    return axiosClient.put(`${baseURL}/productgroup/Update/${id}`, payload);
  }

  delete(id: number | null) {
    return axiosClient.delete(`${baseURL}/product-group/${id}`);
  }
}

export default new ProductGroupService();
