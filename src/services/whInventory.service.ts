import axiosClient from 'api';
import { baseURL } from 'config';
import { IInventoryRecord } from 'interface';
import { FilterParams } from 'types/common';

interface IDetailAdd {
  idProduct: number | null;
  idGroupProduct: number | null;
}

class WhInventoryService {
  getNameProduct() {
    return axiosClient.get(`${baseURL}/whInventory/getNameProduct`);
  }

  getGroupProduct() {
    return axiosClient.get(`${baseURL}/whInventory/getGroupProduct`);
  }

  getwhInventory(body: IDetailAdd) {
    return axiosClient.get(`${baseURL}/whInventory/getwhInventory`, {
      params: body,
    });
  }

  create(payload: IInventoryRecord) {
    return axiosClient.post(`${baseURL}/whInventory/create`, {
      ...payload,
      id: 0,
      creationTime: '2022-07-27T09:24:23.537Z',
      creatorId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
      lastModificationTime: '2022-07-27T09:24:23.537Z',
      lastModifierId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    });
  }

  update(payload: IInventoryRecord) {
    return axiosClient.post(
      `${baseURL}/whInventory/update/${payload.code}`,
      payload
    );
  }
  searchInventoryWH({
    searchText,
    sortBy,
    pageIndex,
    pageSize,
    startDate,
    lastDate,
  }: FilterParams) {
    return axiosClient.get(`${baseURL}/whInventory/searchInventoryWH`, {
      params: {
        Keyword: searchText,
        SkipCount: (pageIndex - 1) * pageSize,
        MaxResultCount: pageSize,
        From: startDate,
        To: lastDate,
      },
    });
  }

  detailInventoryWH(id: string) {
    return axiosClient.get(`${baseURL}/whInventory/detailInventoryWH/${id}`);
  }

  public async dowLoadFile(id: string) {
    return axiosClient.get(`${baseURL}/whInventory/exportPDFInventoryWH`, {
      params: { key: id },
    });
  }
}

export default new WhInventoryService();
