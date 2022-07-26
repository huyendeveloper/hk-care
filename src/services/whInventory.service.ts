import axiosClient from 'api';
import { baseURL } from 'config';

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
}

export default new WhInventoryService();
