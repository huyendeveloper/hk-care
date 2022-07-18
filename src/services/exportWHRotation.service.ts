import axiosClient from 'api';
import { baseURL } from 'config';
import { IExportWHRotation } from 'interface';
import { FilterParams } from 'types';
import DateFns from 'utils/DateFns';

class ExportWHRotationService {
  getProductList({ pageIndex, pageSize, sortBy, searchText }: FilterParams) {
    return axiosClient.get(`${baseURL}/exportWH/GetAllNameRotationExport`);
  }

  addToListExportWHRotation(productId: number) {
    return axiosClient.get(
      `${baseURL}/exportWH/AddExportRotation/${productId}`
    );
  }

  create(payload: IExportWHRotation) {
    return axiosClient.post(
      `${baseURL}/exportWH/CreateExportRotation`,
      payload
    );
  }

  update(payload: IExportWHRotation) {
    return axiosClient.put(
      `${baseURL}/exportWH/UpdateExportRotation/${payload.exportWHId}`,
      payload
    );
  }

  getDetail(id: number, childId: number) {
    return axiosClient.get(`${baseURL}/exportWH/GetDetailRotation/${id}`, {
      params: { childId },
    });
  }

  getAll({
    pageIndex,
    pageSize,
    searchText,
    startDate,
    lastDate,
  }: FilterParams) {
    return axiosClient.get(`${baseURL}/exportWH/GetAllRotationExport`, {
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

export default new ExportWHRotationService();
