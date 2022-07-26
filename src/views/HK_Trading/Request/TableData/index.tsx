import DownloadIcon from '@mui/icons-material/Download';
import { LoadingButton } from '@mui/lab';
import { Paper, Table, TableBody, TableContainer } from '@mui/material';
import { Scrollbar } from 'components/common';
import { TableContent, TableSearchField, TableWrapper } from 'components/Table';
import { defaultFilters } from 'constants/defaultFilters';
import { useNotification } from 'hooks';
import { IRequestImport, IUser } from 'interface';
import { useEffect, useMemo, useState } from 'react';
import { FilterParams } from 'types';
import TableHeader, { Cells } from '../components/TableHeader';
import ExpandRow from './ExpandRow';

const getCells = (): Cells<IRequestImport> => [
  { id: 'id', label: 'STT' },
  { id: 'id', label: 'Điểm bán' },
  { id: 'id', label: 'Số lượng' },
  { id: 'expectedDate', label: 'Ngày yêu cầu' },
];

const TableData = () => {
  const setNotification = useNotification();
  const [loading, setLoading] = useState<boolean>(true);
  const [totalRows, setTotalRows] = useState<number>(0);
  const [currentID, setCurrentID] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterParams>(defaultFilters);
  const [openFormDialog, setOpenFormDialog] = useState<boolean>(false);
  const [requestImport, setRequestImport] = useState<object>([]);

  const cells = useMemo(() => getCells(), []);

  const handleSearch = (searchText: string) => {
    setFilters((state) => ({
      ...state,
      searchText,
    }));
  };

  const fetchData = async () => {
    const payload = {
      requestImportList: [
        {
          id: 1,
          code: 'RQ01',
          requestDate: new Date('2022/12/15'),
          productName: 'Thuốc ho',
          tenant: 'Hà Nội',
          quantity: 40,
        },
      ],
      totalCount: 130,
    };
    const requestImportList = [
      ...(payload.requestImportList as IRequestImport[]),
    ].reduce((group, product) => {
      // @ts-ignore
      const { productName } = product;
      // @ts-ignore
      group[productName] = group[productName] ?? [];
      // @ts-ignore
      group[productName].push(product);
      return group;
    }, {});

    setRequestImport(requestImportList);
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
      sortDirection: state.sortDirection === 'asc' ? 'desc' : 'asc',
    }));
  };

  return (
    <TableWrapper sx={{ height: 1 }} component={Paper}>
      <TableSearchField
        title="Danh sách yêu cầu nhập"
        placeHolder="Tìm kiếm sản phẩm"
        onSearch={handleSearch}
        searchText={filters.searchText}
      >
        <LoadingButton
          loadingPosition="start"
          startIcon={<DownloadIcon />}
          sx={{ height: '40px', width: '100px' }}
          variant="outlined"
        >
          PDF
        </LoadingButton>
      </TableSearchField>
      <TableContent total={Object.keys(requestImport).length} loading={loading}>
        <TableContainer sx={{ p: 1.5 }}>
          <Scrollbar>
            <Table sx={{ minWidth: 'max-content' }} size="small">
              <TableHeader
                cells={cells}
                onSort={handleOnSort}
                sortDirection={filters.sortDirection}
                sortBy={filters.sortBy}
              />

              <TableBody>
                {Object.keys(requestImport).map((key, index) => {
                  return (
                    <ExpandRow
                      key={key}
                      groupName={key}
                      // @ts-ignore
                      list={requestImport[key]}
                      filters={filters}
                      index={index + 1}
                    />
                  );
                })}
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>
      </TableContent>
    </TableWrapper>
  );
};

export default TableData;
