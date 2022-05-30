import axiosClient from 'api';
import axios from 'axios';
import { baseURL } from 'config';
import { IProduct } from 'interface';
import { FilterParams } from 'types';
import LocalStorage from 'utils/LocalStorage';
import moment from 'moment';

const getFormData = (payload: IProduct, file: any) => {
  const params = new FormData();

  params.append('name', payload.name);
  payload.numberRegister &&
    params.append('numberRegister', payload.numberRegister.toString());
  payload.productGroupId &&
    params.append('productGroupId', payload.productGroupId.toString());
  payload.lotNumber && params.append('lotNumber', payload.lotNumber.toString());
  payload.treamentGroupId &&
    params.append('treamentGroupId', payload.treamentGroupId.toString());
  payload.outOfDate &&
    params.append('outOfDate', moment(payload.outOfDate).format('YYYY/MM/DD'));
  payload.usageId && params.append('usageId', payload.usageId.toString());
  payload.mesureLevelFisrt &&
    params.append('mesureLevelFisrt', payload.mesureLevelFisrt.toString());
  payload.amountFirst &&
    params.append('amountFirst', payload.amountFirst.toString());
  payload.mesureLevelSecond &&
    params.append('mesureLevelSecond', payload.mesureLevelSecond.toString());
  payload.amountSecond &&
    params.append('amountSecond', payload.amountSecond.toString());
  payload.mesureLevelThird &&
    params.append('mesureLevelThird', payload.mesureLevelThird.toString());
  payload.producer && params.append('producer', payload.producer);
  payload.dateManufacture &&
    params.append(
      'dateManufacture',
      moment(payload.dateManufacture).format('YYYY/MM/DD')
    );
  payload.importPrice &&
    params.append('importPrice', payload.importPrice.toString());
  payload.price && params.append('price', payload.price.toString());
  payload.productsSupplier &&
    payload.productsSupplier.forEach((item) => {
      params.append('productsSupplier', item.toString());
    });

  payload.packRule && params.append('packRule', payload.packRule);
  payload.content && params.append('content', payload.content);
  params.append('dosage', payload.dosage);
  params.append('routeOfUse', payload.routeOfUse);
  payload.description && params.append('description', payload.description);

  if (file) {
    params.append('productImage', file);
  }
  return params;
};

class ProductService {
  getAll({
    pageIndex,
    pageSize,
    sortBy,
    searchText,
    supplierId,
  }: FilterParams) {
    return axiosClient.get(
      `${baseURL}/product/SearchAll?Keyword=${searchText}&SkipCount=${
        (pageIndex - 1) * pageSize
      }&MaxResultCount=${pageSize}&supplierId=${supplierId}`
    );
  }

  get(id: number) {
    return axiosClient.get(`${baseURL}/product/GetProductById/${id}`);
  }

  create(payload: IProduct, file: any) {
    const token = LocalStorage.get('accessToken');

    const params = getFormData(payload, file);
    params.append('hidden', 'true');

    return axios({
      method: 'post',
      url: `${baseURL}/product/CreateProduct`,
      data: params,
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });
  }

  update(payload: IProduct, file: any) {
    const token = LocalStorage.get('accessToken');

    const params = getFormData(payload, file);
    params.append('hidden', 'true');

    return axios({
      method: 'put',
      url: `${baseURL}/product/UpdateProduct/${payload.id}`,
      data: params,
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });
  }

  delete(id: number | null) {
    return axiosClient.delete(`${baseURL}/product/${id}`);
  }

  changeStatus(id: number | null, status: boolean) {
    return axiosClient.patch(
      `${baseURL}/product/ChangeStatus/${id}?status=${status}`
    );
  }

  getFile(filePath: string) {
    return axiosClient.get(`${baseURL}/file/url-file?filePath=${filePath}`);
  }
}

export default new ProductService();
