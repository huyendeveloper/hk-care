import axiosClient from 'api';
import { baseURL, connectURL } from 'config';
import { IUser } from 'interface';
import { FilterParams } from 'types';
import DateFns from 'utils/DateFns';

interface IPermission {
  key: string;
  name: string;
  isGrant: boolean;
}

interface IRoleAdmin {
  roleName: string;
  status: boolean;
  permissionDtos: IPermission[];
}
class UserService {
  getAll({
    pageIndex,
    pageSize,
    searchText,
    startDate,
    lastDate,
  }: FilterParams) {
    return axiosClient.get(`${baseURL}/HkGroup/Search`, {
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

  loadRoleConvert() {
    return axiosClient.get(`${baseURL}/HkGroup/LoadRoleConvert`);
  }

  create(payload: IUser) {
    return axiosClient.post(`${baseURL}/Expected/CreateExpected`, payload);
  }

  processRoleAdmin(payload: IRoleAdmin) {
    return axiosClient.post(`${baseURL}/HkGroup/ProcessRoleAdmin`, payload);
  }

  update({ id, ...payload }: IUser) {
    return axiosClient.put(`${baseURL}/usage/Update/${id}`, payload);
  }

  get(id: string) {
    return axiosClient.get(`${baseURL}/HkGroup/Detail`, { params: { id } });
  }

  changeStatus(id: number, status: boolean) {
    return axiosClient.patch(`${baseURL}/product/ChangeStatus/${id}`, null, {
      params: {
        status,
      },
    });
  }

  getAllRoles() {
    return axiosClient.get(`${baseURL}/HkGroup/SearchRole`, {
      params: {
        SkipCount: 0,
        MaxResultCount: 1000,
        Keyword: '',
      },
    });
  }
}

export default new UserService();
