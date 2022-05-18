import axiosClient from 'api';
import { baseURL } from 'config';
import { IProductGroup } from 'interface';
import { FilterParams } from 'types';

class UsageService {
  getAll({ pageIndex, pageSize, sortBy, searchText }: FilterParams) {
    return axiosClient.post(`${baseURL}/app/usage/search-all`, {
      maxResultCount: pageSize,
      skipCount: (pageIndex - 1) * pageSize,
      sorting: sortBy,
      keyword: searchText,
    });
  }

  get(id: number) {
    return axiosClient.get(`${baseURL}/app/usage/${id}`);
  }

  create(payload: IProductGroup) {
    return axiosClient.post(`${baseURL}/app/usage`, payload);
  }

  update({ id, ...payload }: IProductGroup) {
    return axiosClient.put(`${baseURL}/app/usage/${id}`, payload);
  }

  delete(id: number | null) {
    return axiosClient.delete(`${baseURL}/app/usage/${id}`);
  }
}

export default new UsageService();
