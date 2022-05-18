import axiosClient from 'api';
import { baseURL } from 'config';
import { ITreatmentGroup } from 'interface';
import { FilterParams } from 'types';

class TreatmentGroupService {
  getAll({ pageIndex, pageSize, sortBy, searchText }: FilterParams) {
    return axiosClient.post(`${baseURL}/app/treatment-group/search-all`, {
      maxResultCount: pageSize,
      skipCount: (pageIndex - 1) * pageSize,
      sorting: sortBy,
      keyword: searchText,
    });
  }

  get(id: number) {
    return axiosClient.get(`${baseURL}/app/treatment-group/${id}`);
  }

  create(payload: ITreatmentGroup) {
    return axiosClient.post(`${baseURL}/app/treatment-group`, payload);
  }

  update({ id, ...payload }: ITreatmentGroup) {
    return axiosClient.put(`${baseURL}/app/treatment-group/${id}`, payload);
  }

  delete(id: number | null) {
    return axiosClient.delete(`${baseURL}/app/treatment-group/${id}`);
  }
}

export default new TreatmentGroupService();
