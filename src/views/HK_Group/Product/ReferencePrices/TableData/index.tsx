import VisibilityIcon from '@mui/icons-material/Visibility';
import {
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow
} from '@mui/material';
import { LinkIconButton, Scrollbar } from 'components/common';
import {
  TableContent,
  TableHeader,
  TablePagination,
  TableSearchField,
  TableWrapper
} from 'components/Table';
import { Cells } from 'components/Table/TableHeader';
import { defaultFilters } from 'constants/defaultFilters';
import { IReferencePricesMock } from 'interface';
import { useEffect, useMemo, useState } from 'react';
import { FilterParams } from 'types';

const getCells = (): Cells<IReferencePricesMock> => [
  { id: 'id', label: 'STT' },
  { id: 'name', label: 'Tên thuốc' },
  { id: 'mesure', label: 'Đơn vị' },
  { id: 'type', label: 'Loại thuốc' },
  { id: 'importPrice', label: 'Giá nhập' },
  { id: 'price', label: 'Giá bán' },
  { id: 'id', label: 'Thao tác' },
];

const TableData = () => {
  const [filters, setFilters] = useState<FilterParams>(defaultFilters);
  const [totalRows, setTotalRows] = useState<number>(0);
  const [referencePrices, setReferencePrices] = useState<
    IReferencePricesMock[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const cells = useMemo(() => getCells(), []);

  const fetchData = async () => {
    // @ts-ignore
    // const { payload, error } = await dispatch(getAllProduct(filters));

    // if (error) {
    //   setNotification({
    //     error: 'Lỗi!',
    //   });
    //   return;
    // }
    // setReferencePrices(payload.referencePrices);
    // setTotalRows(payload.totalCount);
    const mockReferencePrices: IReferencePricesMock[] = [
      {
        id: 1,
        name: 'Skipper',
        mesure: 'Southeran',
        type: 'Thoughtbridge',
        importPrice: 83,
        price: 57,
      },
      {
        id: 2,
        name: 'Devonna',
        mesure: 'Chesnut',
        type: 'Oyope',
        importPrice: 28,
        price: 9,
      },
      {
        id: 3,
        name: 'Arleen',
        mesure: 'Rigg',
        type: 'Buzzbean',
        importPrice: 4,
        price: 36,
      },
      {
        id: 4,
        name: 'Izak',
        mesure: 'Villalta',
        type: 'Tagfeed',
        importPrice: 76,
        price: 100,
      },
      {
        id: 5,
        name: 'Vassili',
        mesure: 'Penlington',
        type: 'Yakidoo',
        importPrice: 33,
        price: 74,
      },
      {
        id: 6,
        name: 'Nels',
        mesure: 'Rayne',
        type: 'Cogidoo',
        importPrice: 46,
        price: 47,
      },
      {
        id: 7,
        name: 'Malanie',
        mesure: 'Petcher',
        type: 'Quimba',
        importPrice: 62,
        price: 22,
      },
      {
        id: 8,
        name: 'Ingaborg',
        mesure: 'Alsopp',
        type: 'Pixope',
        importPrice: 57,
        price: 85,
      },
      {
        id: 9,
        name: 'Hilarius',
        mesure: 'Rehn',
        type: 'Rhynoodle',
        importPrice: 54,
        price: 68,
      },
      {
        id: 10,
        name: 'Benoit',
        mesure: 'Flicker',
        type: 'Meetz',
        importPrice: 59,
        price: 12,
      },
    ];
    setReferencePrices(mockReferencePrices);
    setTotalRows(mockReferencePrices.length);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const handleSearch = (searchText: string) => {
    setFilters((state) => ({
      ...state,
      searchText,
    }));
  };

  const handleOnSort = (field: string) => {
    setFilters((state) => ({
      ...state,
      sortBy: field,
    }));
  };

  const handleChangePage = (pageIndex: number) => {
    setFilters((state) => ({
      ...state,
      pageIndex,
    }));
  };

  const handleChangeRowsPerPage = (rowsPerPage: number) => {
    setFilters((state) => ({
      ...state,
      pageIndex: 1,
      pageSize: rowsPerPage,
    }));
  };

  const renderAction = (row: IReferencePricesMock) => {
    return (
      <>
        <LinkIconButton to={`/hk_group/product/list/${row.id}`}>
          <IconButton>
            <VisibilityIcon />
          </IconButton>
        </LinkIconButton>
      </>
    );
  };

  return (
    <TableWrapper sx={{ height: 1 }} component={Paper}>
      <TableSearchField
        title="Giá tham chiếu"
        placeHolder="Tìm kiếm"
        onSearch={handleSearch}
        searchText={filters.searchText}
      />
      <TableContent total={referencePrices.length} loading={loading}>
        <TableContainer sx={{ p: 1.5, maxHeight: '60vh' }}>
          <Scrollbar>
            <Table sx={{ minWidth: 'max-content' }} size="small">
              <TableHeader
                cells={cells}
                onSort={handleOnSort}
                sortDirection={filters.sortDirection}
                sortBy={filters.sortBy}
              />

              <TableBody>
                {referencePrices.map((item, index) => {
                  const { id, name, mesure, type, importPrice, price } = item;
                  return (
                    <TableRow hover tabIndex={-1} key={id}>
                      <TableCell>
                        {(filters.pageIndex - 1) * filters.pageSize + index + 1}
                      </TableCell>
                      <TableCell>{name}</TableCell>
                      <TableCell>{mesure}</TableCell>
                      <TableCell>{type}</TableCell>
                      <TableCell>{importPrice}</TableCell>
                      <TableCell>{price}</TableCell>
                      <TableCell align="left">{renderAction(item)}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>

        <TablePagination
          pageIndex={filters.pageIndex}
          totalPages={totalRows}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
          rowsPerPage={filters.pageSize}
          rowsPerPageOptions={[10, 20, 30, 40, 50]}
        />
      </TableContent>
    </TableWrapper>
  );
};

export default TableData;
