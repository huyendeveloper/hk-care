import axiosClient from 'api';
import { baseURL } from 'config';
import { IImportReceipt } from 'interface';
import { FilterParams } from 'types';
import DateFns from 'utils/DateFns';

class ExpectedService {
  getAll({
    pageIndex,
    pageSize,
    searchText,
    startDate,
    lastDate,
  }: FilterParams) {
    return axiosClient.get(`${baseURL}/Expected/SearchExpected`, {
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

  addExpectedDetails() {
    return axiosClient.get(`${baseURL}/Expected/AddExpectedDetails`);
  }

  addExpectedDetail(productId: number) {
    return axiosClient.get(`${baseURL}/Expected/AddExpectedDetail`, {
      params: {
        productId,
      },
    });
  }

  getExpected(expectedId: string) {
    return axiosClient.get(`${baseURL}/Expected/GetExpected`, {
      params: {
        expectedId,
      },
    });
  }

  create(payload: IImportReceipt) {
    return axiosClient.post(`${baseURL}/Expected/CreateExpected`, payload);
  }

  getImportRequestList({
    pageIndex,
    pageSize,
    searchText,
    startDate,
    lastDate,
  }: FilterParams) {
    return axiosClient.get(`${baseURL}/Expected/GetSyntheticRequestImports`, {
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

  dowLoadFile({
    pageIndex,
    pageSize,
    searchText,
    startDate,
    lastDate,
  }: FilterParams) {
    return axiosClient.get(`${baseURL}/Expected/GeneratePdf`, {
      params: {
        // SkipCount: (pageIndex - 1) * pageSize,
        MaxResultCount: 1000,
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

export default new ExpectedService();
