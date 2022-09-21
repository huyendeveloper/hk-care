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

export interface IRoleAdmin {
  roleId?: string;
  roleName: string;
  grantPermissionDtos: IPermission[];
}

export interface IRoleSalePoint {
  roleId?: string;
  roleName: string;
  status: boolean;
  grantPermissionDtos: IPermission[];
}

export interface IUpdateNorma {
  name: string;
  isDefault: boolean;
  isPublic: boolean;
  concurrencyStamp?: string;
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
    return axiosClient.get(`${baseURL}/HkGroup/GetPermissionSalePoint`);
  }

  getPermissionSalePoint() {
    return axiosClient.get(
      `${baseURL}/SalePointPermission/GetPermissionSalePoint`
    );
  }

  create(payload: IUser) {
    return axiosClient.post(`${baseURL}/HkGroup/Insert`, {
      ...payload,
      isActive: true,
    });
  }

  processRoleAdmin(payload: IRoleAdmin) {
    return axiosClient.post(
      `${baseURL}/HkGroup/ChangeSalePointPermission`,
      payload
    );
  }

  changeSalePointPermission(payload: IRoleSalePoint) {
    return axiosClient.post(
      `${baseURL}/SalePointPermission/ChangeSalePointPermission`,
      payload
    );
  }

  changeNameRole(id: string, roleKey: any) {
    return axiosClient.put(`${connectURL}/api/identity/roles/${id}`, roleKey);
  }

  update(payload: IUser) {
    return axiosClient.put(`${baseURL}/HkGroup/Update`, payload);
  }

  get(id: string) {
    return axiosClient.get(`${baseURL}/HkGroup/Detail`, { params: { id } });
  }

  changeStatus(id: number) {
    return axiosClient.put(`${baseURL}/HkGroup/ChangeStatus`, null, {
      params: { id },
    });
  }

  getAllRoles() {
    return axiosClient.get(`${baseURL}/HkGroup/GetPermissionDefault`);
  }

  getPermissionDefault() {
    return axiosClient.get(
      `${baseURL}/SalePointPermission/GetPermissionDefault`
    );
  }

  getAllRolesForAccount() {
    return axiosClient.get(`${baseURL}/HkGroup/LoadRole`);
  }
}

export default new UserService();
