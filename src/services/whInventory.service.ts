import axiosClient from 'api';
import { baseURL } from 'config';
import { IInventoryRecord } from 'interface';

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
}

export default new WhInventoryService();
