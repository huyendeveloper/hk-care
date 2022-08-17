import axiosClient from 'api';
import { baseURL } from 'config';
import { FilterParams } from 'types';
import DateFns from 'utils/DateFns';

class RevenueReportService {
  getRevenueReportAll({
    pageIndex,
    pageSize,
    searchText,
    startDate,
    lastDate,
  }: FilterParams) {
    return axiosClient.get(`${baseURL}/RevenueReport/RevenueReportAll`, {
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

  getRevenueReportByUser({
    pageIndex,
    pageSize,
    searchText,
    startDate,
    lastDate,
    // @ts-ignore
    userId,
  }: FilterParams) {
    return axiosClient.get(`${baseURL}/RevenueReport/RevenueReportByUser`, {
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
        userId,
      },
    });
  }

  getSaleEmployee() {
    return axiosClient.get(`${baseURL}/RevenueReport/GetSaleEmployee`, {
      params: { roleId: '56bad1a4-bcf4-f871-a006-3a040724688e' },
    });
  }

  dowLoadFile(
    { startDate, lastDate }: FilterParams,
    staffChoosed: number | null
  ) {
    if (staffChoosed) {
      return axiosClient.get(
        `${baseURL}/RevenueReport/ExportPDFRevenueReportByUser`,
        {
          params: {
            // SkipCount: (pageIndex - 1) * pageSize,
            MaxResultCount: 1000,
            // Keyword: searchText,
            startDate: startDate
              ? DateFns.format(startDate, 'yyyy-MM-dd') + ' 00:00'
              : '',
            lastDate: lastDate
              ? DateFns.format(lastDate, 'yyyy-MM-dd') + ' 23:59'
              : '',
            userId: staffChoosed,
          },
        }
      );
    }
    return axiosClient.get(
      `${baseURL}/RevenueReport/ExportPDFRevenueReportAll`,
      {
        params: {
          // SkipCount: (pageIndex - 1) * pageSize,
          MaxResultCount: 1000,
          // Keyword: searchText,
          startDate: startDate
            ? DateFns.format(startDate, 'yyyy-MM-dd') + ' 00:00'
            : '',
          lastDate: lastDate
            ? DateFns.format(lastDate, 'yyyy-MM-dd') + ' 23:59'
            : '',
        },
      }
    );
  }
}

export default new RevenueReportService();
