import { TableBody, TableCell, TableRow } from '@mui/material';
import { TableHeader } from 'components/Table';
import type { Cells } from 'components/Table/TableHeader';
import { defaultFilters } from 'constants/defaultFilters';
import { IImportReceipt, IRequestImport, ISalesReport } from 'interface';
import React, { useEffect, useMemo, useState } from 'react';
import type { FilterParams } from 'types/common';
import formatDateTime, { formatDate } from 'utils/dateTimeFormat';
import { numberFormat } from 'utils/numberFormat';
import ExpandRow from './ExpandRow';

const getCells = (): Cells<IImportReceipt> => [
  {
    id: 'id',
    label: 'STT',
  },
  {
    id: 'id',
    label: 'Mã hóa đơn',
  },
  {
    id: 'id',
    label: 'Nhân viên bán hàng',
  },
  {
    id: 'creationTime',
    label: 'Ngày bán',
  },
  {
    id: 'moneyToPay',
    label: 'Giá trị hóa đơn',
  },
  {
    id: 'debts',
    label: 'Doanh thu',
  },
];

const DefaultFilter = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [totalRows, setTotalRows] = useState<number>(0);
  const [salesReport, setSalesReport] = useState<object>([]);
  const [filters, setFilters] = useState<FilterParams>(defaultFilters);

  const cells = useMemo(() => getCells(), []);

  const fetchData = async () => {
    // @ts-ignore
    // const { payload, error } = await dispatch(getAllExportWHRotation(filters));
    // if (error) {
    //   setNotification({ error: 'Lỗi!' });
    //   setLoading(false);
    //   return;
    // }
    const payload = {
      salesReport: [
        {
          id: 1,
          code: 'RQ01',
          saleDate: new Date('2022/12/15'),
          staffName: 'Nguyễn Thu Hà',
          orderValue: 300000,
        },
        {
          id: 3,
          code: 'RQ01',
          saleDate: new Date('2022/12/15'),
          staffName: 'Nguyễn Thu Hà',
          orderValue: 300000,
        },
        {
          id: 1,
          code: 'RQ01',
          saleDate: new Date('2022/12/16'),
          staffName: 'Nguyễn Thu Hà',
          orderValue: 300000,
        },
        {
          id: 3,
          code: 'RQ01',
          saleDate: new Date('2022/12/16'),
          staffName: 'Nguyễn Thu Hà',
          orderValue: 300000,
        },
      ],
      totalCount: 130,
    };
    const salesReport = [...(payload.salesReport as ISalesReport[])].reduce(
      (group, product) => {
        // @ts-ignore
        const { saleDate } = product;
        // @ts-ignore
        group[formatDate(saleDate)] = group[formatDate(saleDate)] ?? [];
        // @ts-ignore
        group[formatDate(saleDate)].push(product);
        return group;
      },
      {}
    );

    setSalesReport(salesReport);
    setTotalRows(payload.totalCount);
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const handleOnSort = (field: string) => {
    setFilters((state) => ({
      ...state,
      sortBy: field,
    }));
  };

  return (
    <>
      <TableHeader
        cells={cells}
        onSort={handleOnSort}
        sortDirection={filters.sortDirection}
        sortBy={filters.sortBy}
      />

      <TableBody>
        {Object.keys(salesReport).map((key, index) => {
          return (
            <ExpandRow
              key={key}
              groupName={key} // @ts-ignore
              list={salesReport[key]}
              filters={filters}
            />
          );
        })}
      </TableBody>
    </>
  );
};

export default React.memo(DefaultFilter);
