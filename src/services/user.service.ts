import axiosClient from 'api';
import { baseURL, connectURL } from 'config';
import { IUser } from 'interface';
import { FilterParams } from 'types';
import DateFns from 'utils/DateFns';

class UserService {
  getAll({
    pageIndex,
    pageSize,
    searchText,
    startDate,
    lastDate,
  }: FilterParams) {
    return axiosClient.get(`${baseURL}/identity/users`, {
      params: {
        SkipCount: (pageIndex - 1) * pageSize,
        MaxResultCount: pageSize,
        Keyword: searchText,
        startDate: startDate
          ? DateFns.format(startDate, 'yyyy-MM-dd') + ' 00:00'
          : '',
        lastDate: lastDate
          ? DateFns.format(lastDate, 'yyyy-MM-dd') + ' 23:59'
          : '',
      },
    });
  }

  getRoleCurrent() {
    return axiosClient.get(`${connectURL}/api/identity/roles/GetRoleCurrent`);
  }

  create(payload: IUser) {
    return axiosClient.post(`${baseURL}/Expected/CreateExpected`, payload);
  }

  update({ id, ...payload }: IUser) {
    return axiosClient.put(`${baseURL}/usage/Update/${id}`, payload);
  }

  get(id: number) {
    return axiosClient.get(`${baseURL}/whInventory/detailInventoryWH/${id}`);
  }

  changeStatus(id: number, status: boolean) {
    return axiosClient.patch(`${baseURL}/product/ChangeStatus/${id}`, null, {
      params: {
        status,
      },
    });
  }

  getAllRoles() {
    return axiosClient.get(`${baseURL}/UserConfig/LoadRoleSalePoint`, {
      params: { key: '' },
    });
  }
}

export default new UserService();
