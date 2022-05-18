import axiosClient from 'api';
import { baseURL } from 'config';
import { IMeasure } from 'interface';
import { FilterParams } from 'types';

class MeasureService {
  getAll({ pageIndex, pageSize, sortBy, searchText }: FilterParams) {
    return axiosClient.post(`${baseURL}/app/measure/search-all`, {
      maxResultCount: pageSize,
      skipCount: (pageIndex - 1) * pageSize,
      sorting: sortBy,
      keyword: searchText,
    });
  }

  get(id: number) {
    return axiosClient.get(`${baseURL}/app/measure/${id}`);
  }

  create(payload: IMeasure) {
    return axiosClient.post(`${baseURL}/app/measure`, payload);
  }

  update({ id, ...payload }: IMeasure) {
    return axiosClient.put(`${baseURL}/app/measure/${id}`, payload);
  }

  delete(id: number | null) {
    return axiosClient.delete(`${baseURL}/app/measure/${id}`);
  }
}

export default new MeasureService();
