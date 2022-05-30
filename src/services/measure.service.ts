import axiosClient from 'api';
import { baseURL } from 'config';
import { IMeasure } from 'interface';
import { FilterParams } from 'types';

class MeasureService {
  getAll({ pageIndex, pageSize, sortBy, searchText }: FilterParams) {
    return axiosClient.get(
      `${baseURL}/measure/search-all?Keyword=${searchText}&Sorting=${sortBy}&SkipCount=${
        (pageIndex - 1) * pageSize
      }&MaxResultCount=${pageSize}`
    );
  }

  getAllMeasure() {
    return axiosClient.get(`${baseURL}/measure/search-all`);
  }

  get(id: number) {
    return axiosClient.get(`${baseURL}/measure/${id}`);
  }

  create(payload: IMeasure) {
    return axiosClient.post(`${baseURL}/measure/Create`, payload);
  }

  update({ id, ...payload }: IMeasure) {
    return axiosClient.put(`${baseURL}/measure/Update/${id}`, payload);
  }

  delete(id: number | null) {
    return axiosClient.delete(`${baseURL}/measure/${id}`);
  }
}

export default new MeasureService();
