import axiosClient from 'api';
import { baseURL } from 'config';
import { IProductGroup } from 'interface';
import { FilterParams } from 'types';

class ProductGroupService {
  getAll({ pageIndex, pageSize, sortBy, searchText }: FilterParams) {
    return axiosClient.get(`${baseURL}/product-group/search-all`, {
      params: {
        Keyword: searchText,
        Sorting: sortBy,
        SkipCount: (pageIndex - 1) * pageSize,
        MaxResultCount: pageSize,
      },
    });
  }

  getAllProductGroup() {
    return axiosClient.get(`${baseURL}/product-group/search-all`);
  }

  create(payload: IProductGroup) {
    return axiosClient.post(`${baseURL}/productgroup/Create`, payload);
  }

  update({ id, ...payload }: IProductGroup) {
    return axiosClient.put(`${baseURL}/productgroup/Update/${id}`, payload);
  }

  delete(id: number | null) {
    return axiosClient.delete(`${baseURL}/productgroup/Delete/${id}`);
  }
}

export default new ProductGroupService();
