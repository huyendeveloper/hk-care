import axiosClient from 'api';
import { baseURL } from 'config';
import { IExportCancel } from 'interface';
import { FilterParams } from 'types';
import DateFns from 'utils/DateFns';

interface IDetailAdd {
  productId: number | null;
  from: number | null;
  to: number | null;
}

class ExportCancelService {
  getProductList({ pageIndex, pageSize, sortBy, searchText }: FilterParams) {
    return axiosClient.get(`${baseURL}/exportWH/GetAllNameCancelExport`);
  }

  addToListExportCancel({ productId, from, to }: IDetailAdd) {
    return axiosClient.get(`${baseURL}/exportWH/AddToListExportCancel`, {
      params: {
        productId,
        from,
        to,
      },
    });
  }

  create(payload: IExportCancel) {
    return axiosClient.post(`${baseURL}/exportWH/Create`, payload);
  }

  update(payload: IExportCancel) {
    return axiosClient.put(
      `${baseURL}/exportWH/UpdateAsync/${payload.id}`,
      payload
    );
  }

  getGetDetail(id: number) {
    return axiosClient.get(`${baseURL}/exportWH/GetDetailUpdate/${id}`);
  }

  getAll({
    pageIndex,
    pageSize,
    searchText,
    startDate,
    lastDate,
  }: FilterParams) {
    return axiosClient.get(`${baseURL}/exportWH/SearchAll`, {
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
}

export default new ExportCancelService();
