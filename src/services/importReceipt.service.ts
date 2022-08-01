import axiosClient from 'api';
import axios from 'axios';
import { baseURL } from 'config';
import { IImportReceipt } from 'interface';
import { FilterParams } from 'types';
import DateFns from 'utils/DateFns';
import LocalStorage from 'utils/LocalStorage';

class ImportReceiptService {
  getPathFileReceipt(file: any) {
    const token = LocalStorage.get('accessToken');

    const params = new FormData();

    if (file) {
      params.append('fileDetails', file);
    }

    return axios({
      method: 'post',
      url: `${baseURL}/receiptwarehouse/GetPathFileReceipt`,
      data: params,
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });
  }

  create(payload: IImportReceipt) {
    return axiosClient.post(`${baseURL}/receiptwarehouse/Create`, payload);
  }

  update(payload: IImportReceipt) {
    return axiosClient.put(
      `${baseURL}/receiptwarehouse/Update/${payload.id}`,
      payload
    );
  }

  getAll({
    pageIndex,
    pageSize,
    searchText,
    startDate,
    lastDate,
  }: FilterParams) {
    return axiosClient.get(`${baseURL}/receiptwarehouse/SearchAll`, {
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

  get(id: number) {
    return axiosClient.get(`${baseURL}/receiptwarehouse/GetDetail/${id}`);
  }
}

export default new ImportReceiptService();
