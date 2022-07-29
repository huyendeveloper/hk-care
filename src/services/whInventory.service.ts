import axiosClient from 'api';
import { baseURL, connectURL } from 'config';
import { IInventoryRecord, InventoryItemDto } from 'interface';
import { FilterParams } from 'types/common';
import fileDownload from 'js-file-download';

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

  update(payload: IInventoryRecord, codeInventory: string) {
    return axiosClient.post(`${baseURL}/whInventory/update/${codeInventory}`, {
      ...payload,
    });
  }
  searchInventoryWH({ searchText, sortBy, pageIndex, pageSize, startDate, lastDate }: FilterParams) {
    return axiosClient.get(`${baseURL}/whInventory/searchInventoryWH`, {
      params: {
        Keyword: searchText,
        SkipCount: (pageIndex - 1) * pageSize,
        MaxResultCount: pageSize,
        From: startDate,
        To: lastDate
      },
    });
  }

  detailInventoryWH(id: string) {
    return axiosClient.get(`${baseURL}/whInventory/detailInventoryWH/${id}`);
  }

  public async dowLoadFile(id: string) {
    axiosClient.get(`${baseURL}/whInventory/exportPDFInventoryWH`, { params: { key: id } });
  }

  public getDataFile(res: any, id: string) {
    axiosClient.get(`${connectURL}/${res.data.data}`, {
      responseType: 'blob',
    })
      .then((res2) => {
        console.log('res2', res2.data);
        fileDownload(res2.data, `${id + '.pdf'}`)
      });
  }

}

export default new WhInventoryService();
