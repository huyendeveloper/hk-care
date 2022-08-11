import axiosClient from 'api';
import { baseURL } from 'config';
import { IStaff } from 'interface';
import { FilterParams } from 'types';

class StaffService {
  getAll({ pageIndex, pageSize, sortBy, searchText }: FilterParams) {
    return axiosClient.get(
      `${baseURL}/SalePointEmployee/SearchSalePointEmployee`,
      {
        params: {
          Keyword: searchText,
          Sorting: sortBy,
          SkipCount: (pageIndex - 1) * pageSize,
          MaxResultCount: pageSize,
        },
      }
    );
  }

  // getAllStaff() {
  //   return axiosClient.get(`${baseURL}/SalePointEmployee/GetStaffActive`);
  // }

  get(id: string) {
    return axiosClient.get(
      `${baseURL}/SalePointEmployee/GetDetailSalePointEmployee`,
      { params: { salePointEmployeeId: id } }
    );
  }

  create(payload: IStaff) {
    return axiosClient.post(
      `${baseURL}/SalePointEmployee/CreatedSalePointEmployee`,
      {
        ...payload,
        roleId: '1c1e1bae-762b-5de0-28c2-3a0407245cd1',
      }
    );
  }

  // update(payload: IStaff) {
  //   return axiosClient.put(`${baseURL}/SalePointEmployee/Update/${payload.id}`, payload);
  // }

  // delete(id: number) {
  //   return axiosClient.delete(`${baseURL}/SalePointEmployee/${id}`);
  // }

  changeStatus(id: number) {
    return axiosClient.put(`${baseURL}/SalePointEmployee/ChangeStatus`, null, {
      params: { salePointEmployeeId: id },
    });
  }
}

export default new StaffService();
