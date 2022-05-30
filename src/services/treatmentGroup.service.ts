import axiosClient from 'api';
import { baseURL } from 'config';
import { ITreatmentGroup } from 'interface';
import { FilterParams } from 'types';

class TreatmentGroupService {
  getAll({ pageIndex, pageSize, sortBy, searchText }: FilterParams) {
    return axiosClient.get(
      `${baseURL}/treatment-group/search-all?Keyword=${searchText}&Sorting=${sortBy}&SkipCount=${
        (pageIndex - 1) * pageSize
      }&MaxResultCount=${pageSize}`
    );
  }

  getAllTreatmentGroup() {
    return axiosClient.get(`${baseURL}/treatment-group/search-all`);
  }

  get(id: number) {
    return axiosClient.get(`${baseURL}/treatment-group/${id}`);
  }

  create(payload: ITreatmentGroup) {
    return axiosClient.post(`${baseURL}/treatmentgroup/Create`, payload);
  }

  update({ id, ...payload }: ITreatmentGroup) {
    return axiosClient.put(`${baseURL}/treatmentgroup/Update/${id}`, payload);
  }

  delete(id: number | null) {
    return axiosClient.delete(`${baseURL}/treatment-group/${id}`);
  }
}

export default new TreatmentGroupService();
