import axiosClient from 'api';
import { baseURL } from 'config';
import { IExportWHRotation } from 'interface';
import { FilterParams } from 'types';
import DateFns from 'utils/DateFns';

interface IDetailAdd {
  productId: number | null;
  from: number | null;
  to: number | null;
}

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
    sortBy,
    searchText,
    startDate,
    lastDate,
  }: FilterParams) {
    return axiosClient.get(
      `${baseURL}/exportWH/GetAllRotationExport?Keyword=${searchText}&SkipCount=${
        (pageIndex - 1) * pageSize
      }&MaxResultCount=${pageSize}&startDate=${
        startDate ? DateFns.format(startDate, 'yyyy-MM-dd') + ' 00:00' : ''
      }&lastDate=${
        lastDate ? DateFns.format(lastDate, 'yyyy-MM-dd') + ' 23:59' : ''
      }`
    );
  }
}

export default new ExportWHRotationService();
