import axiosClient from 'api';
import axios from 'axios';
import { baseURL } from 'config';
import { ISupplier } from 'interface';
import { FilterParams } from 'types';
import LocalStorage from 'utils/LocalStorage';

class SupplierService {
  getAll({ pageIndex, pageSize, sortBy, searchText }: FilterParams) {
    return axiosClient.get(
      `${baseURL}/supplier/search-all?Keyword=${searchText}&Sorting=${sortBy}&SkipCount=${
        (pageIndex - 1) * pageSize
      }&MaxResultCount=${pageSize}`
    );
  }

  getAllSupplier() {
    return axiosClient.get(`${baseURL}/supplier/search-all`);
  }

  get(id: number) {
    return axiosClient.get(`${baseURL}/supplier/${id}`);
  }

  create(payload: ISupplier, file: any) {
    const params = new FormData();

    params.append('name', payload.name);
    payload.address && params.append('address', payload.address);
    payload.nameContact && params.append('nameContact', payload.nameContact);
    params.append('telephoneNumber', payload.telephoneNumber);
    payload.mobileNumber && params.append('mobileNumber', payload.mobileNumber);
    payload.fax && params.append('fax', payload.fax);
    payload.taxCode && params.append('taxCode', payload.taxCode);
    if (file) {
      params.append('bussinessLicense', file, file.name);
    }
    payload.description && params.append('description', payload.description);
    params.append('active', '1');

    const token = LocalStorage.get('accessToken');

    return axios({
      method: 'post',
      url: `${baseURL}/supplier/Create`,
      data: params,
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });
  }

  update(payload: ISupplier, file: any) {
    const params = new FormData();

    params.append('name', payload.name);
    payload.address && params.append('address', payload.address);
    payload.nameContact && params.append('nameContact', payload.nameContact);
    params.append('telephoneNumber', payload.telephoneNumber);
    payload.mobileNumber && params.append('mobileNumber', payload.mobileNumber);
    payload.fax && params.append('fax', payload.fax);
    payload.taxCode && params.append('taxCode', payload.taxCode);
    if (file && file.type) {
      params.append('bussinessLicense', file, file.name);
    }
    payload.description && params.append('description', payload.description);
    payload.active && params.append('active', payload.active.toString());

    const token = LocalStorage.get('accessToken');

    return axios({
      method: 'put',
      url: `${baseURL}/supplier/Update/${payload.id}`,
      data: params,
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });
  }

  delete(id: number | null) {
    return axiosClient.delete(`${baseURL}/supplier/${id}`);
  }

  changeStatus(id: number | null, status: 2 | 1) {
    return axiosClient.post(
      `${baseURL}/supplier/ChangeStatus?supplierId=${id}&status=${status}`
    );
  }

  getFile(filePath: string) {
    return axiosClient.get(`${baseURL}/file/url-file?filePath=${filePath}`);
  }
}

export default new SupplierService();
