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
  getAll({ pageIndex, pageSize, sortBy, searchText }: FilterParams) {
    return axiosClient.get(
      `${baseURL}/ProductList/SearchRegisterProduct?Keyword=${searchText}&SkipCount=${
        (pageIndex - 1) * pageSize
      }&MaxResultCount=${pageSize}`
    );
    // return axiosClient.post(`${baseURL}/ProductList/SearchRegisterProduct`, {
    //   maxResultCount: pageSize,
    //   skipCount: (pageIndex - 1) * pageSize,
    //   sorting: '',
    //   keyword: 'searchText',
    //   descending: false,
    // });
  }

  getAllProduct({ pageIndex, pageSize, sortBy, searchText }: FilterParams) {
    return axiosClient.get(
      `${baseURL}/ProductList/SearchAll?Keyword=${searchText}&SkipCount=${
        (pageIndex - 1) * pageSize
      }&MaxResultCount=${pageSize}`
    );
    // return axiosClient.post(`${baseURL}/ProductList/SearchAll`, {
    //   maxResultCount: pageSize,
    //   skipCount: (pageIndex - 1) * pageSize,
    //   sorting: '',
    //   keyword: 'searchText',
    //   descending: false,
    // });
  }

  getAllProductRegisted({
    pageIndex,
    pageSize,
    sortBy,
    searchText,
  }: FilterParams) {
    return axiosClient.get(
      `${baseURL}/ProductList/SearchRegisterProductList?Keyword=${searchText}&SkipCount=${
        (pageIndex - 1) * pageSize
      }&MaxResultCount=${pageSize}`
    );

    // return axiosClient.post(
    //   `${baseURL}/ProductList/SearchRegisterProductList`,
    //   {
    //     maxResultCount: pageSize,
    //     skipCount: (pageIndex - 1) * pageSize,
    //     sorting: '',
    //     keyword: 'searchText',
    //     descending: false,
    //   }
    // );
  }

  get(id: number) {
    return axiosClient.get(
      `${baseURL}/ProductList/GetProductListDetail?productId=${id}`
    );
  }

  create(payload: { listProductId: number[] }) {
    return axiosClient.post(
      `${baseURL}/ProductList/RegisterProducts`,
      payload.listProductId
    );
  }

  update(payload: { price: number; productId: number }) {
    return axiosClient.put(
      `${baseURL}/ProductList/UpdatePrice?productId=${payload.productId}&price=${payload.price}`
    );
  }

  delete(id: number | null) {
    return axiosClient.post(
      `${baseURL}/ProductList/UnRegisterProduct?productId=${id}`
    );
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
