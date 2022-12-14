import axiosClient from 'api';
import { baseURL } from 'config';
import { IUsage } from 'interface';
import { FilterParams } from 'types';

class UsageService {
  getAll({ pageIndex, pageSize, sortBy, searchText }: FilterParams) {
    return axiosClient.get(`${baseURL}/usage/search-all`, {
      params: {
        Keyword: searchText,
        Sorting: sortBy,
        SkipCount: (pageIndex - 1) * pageSize,
        MaxResultCount: pageSize,
      },
    });
  }

  getAllUsage() {
    return axiosClient.get(`${baseURL}/usage/search-all`);
  }

  create(payload: IUsage) {
    return axiosClient.post(`${baseURL}/usage/Create`, payload);
  }

  update({ id, ...payload }: IUsage) {
    return axiosClient.put(`${baseURL}/usage/Update/${id}`, payload);
  }

  delete(id: number | null) {
    return axiosClient.delete(`${baseURL}/usage/Delete/${id}`);
  }
}

export default new UsageService();
