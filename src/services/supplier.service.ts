import axiosClient from 'api';
import axios from 'axios';
import { baseURL } from 'config';
import { ISupplier } from 'interface';
import { FilterParams } from 'types';
import LocalStorage from 'utils/LocalStorage';

class SupplierService {
  getAll({ pageIndex, pageSize, sortBy, searchText }: FilterParams) {
    return axiosClient.post(`${baseURL}/app/supplier/search-all`, {
      maxResultCount: pageSize,
      skipCount: (pageIndex - 1) * pageSize,
      sorting: sortBy,
      keyword: searchText,
    });
  }

  get(id: number) {
    return axiosClient.get(`${baseURL}/app/supplier/${id}`);
  }

  create(payload: ISupplier, file: any) {
    const params = new FormData();

    params.append('name', payload.name);
    params.append('address', payload.address);
    params.append('nameContact', payload.nameContact);
    params.append('telephoneNumber', payload.telephoneNumber);
    params.append('mobileNumber', payload.mobileNumber);
    params.append('fax', payload.fax);
    params.append('taxCode', payload.taxCode);
    if (file) {
      params.append('bussinessLicense', file, file.name);
    }
    params.append('description', payload.description);
    params.append('active', '1');

    const token = LocalStorage.get('accessToken');

    axios({
      method: 'post',
      url: `${baseURL}/app/supplier/Create`,
      data: params,
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });
  }

  update(payload: ISupplier, file: any) {
    // return axiosClient.put(`${baseURL}/app/supplier/${id}`, payload);

    const params = new FormData();

    params.append('name', payload.name);
    params.append('address', payload.address);
    params.append('nameContact', payload.nameContact);
    params.append('telephoneNumber', payload.telephoneNumber);
    params.append('mobileNumber', payload.mobileNumber);
    params.append('fax', payload.fax);
    params.append('taxCode', payload.taxCode);
    if (file && file.type) {
      params.append('bussinessLicense', file, file.name);
    }
    params.append('description', payload.description);
    params.append('active', '1');

    const token = LocalStorage.get('accessToken');

    axios({
      method: 'put',
      url: `${baseURL}/app/supplier/Update/${payload.id}`,
      data: params,
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });
  }

  delete(id: number | null) {
    return axiosClient.delete(`${baseURL}/app/supplier/${id}`);
  }

  changeStatus(id: number | null, status: 2 | 1) {
    return axiosClient.post(
      `${baseURL}/app/supplier/ChangeStatus?supplierId=${id}&status=${status}`
    );
  }

  getFile(filePath: string) {
    return axiosClient.get(`${baseURL}/app/file/url-file?filePath=${filePath}`);
  }
}

export default new SupplierService();
