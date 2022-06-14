import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {
  Button,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from '@mui/material';
import { LinkIconButton, Scrollbar } from 'components/common';
import { DeleteDialog } from 'components/Dialog';
import {
  TableContent,
  TableHeader,
  TablePagination,
  TableSearchField,
  TableWrapper,
} from 'components/Table';
import { Cells } from 'components/Table/TableHeader';
import { defaultFilters } from 'constants/defaultFilters';
import { useNotification } from 'hooks';
import { ITenant } from 'interface';
import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/store';
import { ClickEventCurrying, FilterParams } from 'types';
import AddIcon from '@mui/icons-material/Add';

const getCells = (): Cells<ITenant> => [
  { id: 'id', label: 'STT' },
  { id: 'name', label: 'Tên điểm bán' },
  { id: 'address', label: 'Địa chỉ' },
  { id: 'hotline', label: 'Hotline' },
  { id: 'status', label: 'Trạng thái' },
  { id: 'id', label: 'Thao tác' },
];

const TableData = () => {
  const [filters, setFilters] = useState<FilterParams>(defaultFilters);
  const [totalRows, setTotalRows] = useState<number>(0);
  const [tenantList, setTenantList] = useState<ITenant[]>([]);
  const { loading } = useSelector((state: RootState) => state.product);
  const cells = useMemo(() => getCells(), []);
  const setNotification = useNotification();
  const [currentID, setCurrentID] = useState<string | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  const [openFormDialog, setOpenFormDialog] = useState<boolean>(false);

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const fetchData = async () => {
    // @ts-ignore
    // const { payload, error } = await dispatch(getAllProduct(filters));

    // if (error) {
    //   setNotification({
    //     error: 'Lỗi khi tải danh sách sản phẩm!',
    //   });
    //   return;
    // }
    // setTenantList(payload.tenantList);
    // setTotalRows(payload.totalCount);
    const tenantList: ITenant[] = [
      {
        id: '1',
        name: 'Salvidor',
        address: 'Joselin',
        hotline: '355-395-4971',
        status: false,
      },
      {
        id: '2',
        name: 'Ynes',
        address: 'Potkin',
        hotline: '267-556-7768',
        status: false,
      },
      {
        id: '3',
        name: 'Mahmoud',
        address: "O'Ferris",
        hotline: '926-268-7074',
        status: true,
      },
      {
        id: '4',
        name: 'Andree',
        address: 'Grigoliis',
        hotline: '742-998-5236',
        status: true,
      },
      {
        id: '5',
        name: 'Tonye',
        address: 'Rekes',
        hotline: '142-232-5415',
        status: false,
      },
      {
        id: '6',
        name: 'Erie',
        address: 'Breissan',
        hotline: '563-857-9600',
        status: true,
      },
      {
        id: '7',
        name: 'Hoebart',
        address: 'Palphramand',
        hotline: '540-218-1008',
        status: false,
      },
      {
        id: '8',
        name: 'Inez',
        address: 'Casajuana',
        hotline: '692-598-4730',
        status: true,
      },
      {
        id: '9',
        name: 'Dorisa',
        address: 'Adkins',
        hotline: '244-373-1319',
        status: false,
      },
      {
        id: '10',
        name: 'Johnath',
        address: 'Britee',
        hotline: '750-330-8990',
        status: false,
      },
    ];
    setTenantList(tenantList);
    setTotalRows(tenantList.length);
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

  const handleDelete = async () => {
    if (!currentID) return;
    handleCloseDeleteDialog();
    // @ts-ignore
    const { error } = await dispatch(deleteUsage(currentID));
    if (error) {
      setNotification({ error: 'Lỗi khi xóa điểm bán!' });
      return;
    }
    setNotification({
      message: 'Xóa thành công!',
      severity: 'success',
    });

    setTenantList(tenantList.filter((x) => x.id !== currentID));
  };

  const handleOpenDeleteDialog = (id: string) => () => {
    setCurrentID(id);
    setOpenDeleteDialog(true);
  };

  const handleOpenCreateDialog = () => {
    setCurrentID(null);
    setOpenFormDialog(true);
  };

  const renderAction = (row: ITenant) => {
    return (
      <>
        <LinkIconButton to={`/hk_group/product/list/${row.id}`}>
          <IconButton>
            <VisibilityIcon />
          </IconButton>
        </LinkIconButton>
        <IconButton>
          <EditIcon />
        </IconButton>
        {!row.status && (
          <IconButton onClick={handleOpenDeleteDialog(row.id)}>
            <DeleteIcon />
          </IconButton>
        )}
      </>
    );
  };

  return (
    <TableWrapper sx={{ height: 1 }} component={Paper}>
      <TableSearchField
        title="Danh sách điểm bán"
        placeHolder="Tìm kiếm điểm bán"
        onSearch={handleSearch}
        searchText={filters.searchText}
      >
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={handleOpenCreateDialog}
          sx={{ fontSize: '1rem' }}
        >
          Thêm điểm bán mới
        </Button>
      </TableSearchField>
      <TableContent total={tenantList.length} loading={loading}>
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
                {tenantList.map((item, index) => {
                  const { id, name, address, hotline, status } = item;
                  return (
                    <TableRow hover tabIndex={-1} key={id}>
                      <TableCell>
                        {(filters.pageIndex - 1) * filters.pageSize + index + 1}
                      </TableCell>
                      <TableCell>{name}</TableCell>
                      <TableCell>{address}</TableCell>
                      <TableCell>{hotline}</TableCell>
                      <TableCell>
                        {status ? (
                          <Button>Hoạt động</Button>
                        ) : (
                          <Button color="error">Hoạt động</Button>
                        )}
                      </TableCell>
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

      <DeleteDialog
        id={currentID}
        tableName="điểm bán"
        name={tenantList.find((x) => x.id === currentID)?.name}
        onClose={handleCloseDeleteDialog}
        open={openDeleteDialog}
        handleDelete={handleDelete}
      />
    </TableWrapper>
  );
};

export default TableData;
