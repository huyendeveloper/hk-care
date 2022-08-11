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

  getRoles() {
    return axiosClient.get(`${baseURL}/SalePointEmployee/GetRoles`);
  }

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
      }
    );
  }

  update(payload: IStaff) {
    const { files, ...res } = payload;
    return axiosClient.put(
      `${baseURL}/SalePointEmployee/UpdateSalePointEmloyee`,
      res,
      { params: { salePointEmployeeId: payload.id } }
    );
  }

  changeStatus(id: number) {
    return axiosClient.put(`${baseURL}/SalePointEmployee/ChangeStatus`, null, {
      params: { salePointEmployeeId: id },
    });
  }
}

export default new StaffService();
