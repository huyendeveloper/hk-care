import axiosClient from 'api';
import axios from 'axios';
import { baseURL } from 'config';
import { FilterParams } from 'types';
import DateFns from 'utils/DateFns';
import LocalStorage from 'utils/LocalStorage';

interface OrderSales {
  id: number;
  disCount: number;
  giveMoney: number;
  orderId?: number;
  description: string;
  createOrderDetailDtos: {
    productId: number;
    productName: string;
    quantity: number;
    price: number;
    measureId: number;
    measureName: string;
    discount: number;
    mor: string;
    noon: string;
    night: string;
    description: string;
    billPerProduct: number;
  }[];
}

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

  create(payload: OrderSales) {
    return axiosClient.post(`${baseURL}/BillOfSale/CreateBillOfSale`, payload);
  }

  update(payload: OrderSales) {
    return axiosClient.put(
      `${baseURL}/BillOfSale/UpdateBillOfSale`,
      payload
    );
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
      `${baseURL}/receiptwarehouse/SearchAll?Keyword=${searchText}&SkipCount=${
        (pageIndex - 1) * pageSize
      }&MaxResultCount=${pageSize}&startDate=${
        startDate ? DateFns.format(startDate, 'yyyy-MM-dd') + ' 00:00' : ''
      }&lastDate=${
        lastDate ? DateFns.format(lastDate, 'yyyy-MM-dd') + ' 23:59' : ''
      }`
    );
  }

  get(id: number) {
    return axiosClient.get(`${baseURL}/BillOfSale/GetDetail`, {
      params: { id },
    });
  }
}

export default new ImportReceiptService();
