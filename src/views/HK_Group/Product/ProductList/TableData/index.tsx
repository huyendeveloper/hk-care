import AddIcon from '@mui/icons-material/Add';
import BlockIcon from '@mui/icons-material/Block';
import CheckIcon from '@mui/icons-material/Check';
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
import { BlockDialog, UnBlockDialog } from 'components/Dialog';
import {
  TableContent,
  TableHeader,
  TablePagination,
  TableSearchField,
  TableWrapper,
} from 'components/Table';
import type { Cells } from 'components/Table/TableHeader';
import { useMounted } from 'hooks';
import { IProduct } from 'interface';
import { useEffect, useMemo, useState } from 'react';
import { ClickEventCurrying } from 'types';
import type { FilterParams } from 'types/common';
import FormDialog from '../FormDialog';

const getCells = (): Cells<IProduct> => [
  { id: 'id', label: 'STT' },
  { id: 'name', label: 'Tên sản phẩm' },
  { id: 'group', label: 'Nhóm sản phẩm' },
  { id: 'priceBuy', label: 'Giá nhập' },
  { id: 'priceSale', label: 'Giá bán' },
  { id: 'active', label: 'Hoạt động' },
  { id: 'active', label: 'Thao tác' },
];

const defaultFilters: FilterParams = {
  pageIndex: 1,
  pageSize: 10,
  sortBy: '',
  sortDirection: '',
  searchText: '',
};

const TableData = () => {
  const mounted = useMounted();

  const [currentID, setCurrentID] = useState<number | null>(null);
  const [productList, setProductList] = useState<IProduct[]>([]);
  const [openBlockDialog, setOpenBlockDialog] = useState<boolean>(false);
  const [openUnBlockDialog, setOpenUnBlockDialog] = useState<boolean>(false);
  const [openFormDialog, setOpenFormDialog] = useState<boolean>(false);

  const [totalRows, setTotalRows] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [filters, setFilters] = useState<FilterParams>(defaultFilters);

  const cells = useMemo(() => getCells(), []);

  const fetchData = () => {
    setProductList([
      {
        id: 1,
        name: 'name1',
        group: 'group1',
        priceBuy: 1,
        priceSale: 2,
        active: true,
      },
      {
        id: 2,
        name: 'name2',
        group: 'group2',
        priceBuy: 2,
        priceSale: 2,
        active: false,
      },
      {
        id: 3,
        name: 'name3',
        group: 'group3',
        priceBuy: 3,
        priceSale: 3,
        active: true,
      },
    ]);
    setLoading(false);
    // productService
    //   .getAll(filters)
    //   .then(({ data }) => {
    //     setProductList(data.items ?? []);
    //     setTotalRows(Math.ceil(data?.totalCount / filters.pageSize));
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   })
    //   .finally(() => {
    //     setLoading(false);
    //   });
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

  const handleSearch = (searchText: string) => {
    setFilters((state) => ({
      ...state,
      searchText,
    }));
  };

  const handleOpenCreateDialog = () => {
    setCurrentID(null);
    setOpenFormDialog(true);
  };

  const handleOpenUpdateDialog: ClickEventCurrying = (id) => () => {
    setCurrentID(id);
    setOpenFormDialog(true);
  };

  const handleOpenBlockDialog: ClickEventCurrying = (id) => () => {
    setCurrentID(id);
    setOpenBlockDialog(true);
  };

  const handleOpenUnBlockDialog: ClickEventCurrying = (id) => () => {
    setCurrentID(id);
    setOpenUnBlockDialog(true);
  };

  const handleCloseBlockDialog = () => {
    setOpenBlockDialog(false);
  };

  const handleCloseUnBlockDialog = () => {
    setOpenUnBlockDialog(false);
  };

  const handleCloseFormDialog = (updated: boolean | undefined) => {
    setOpenFormDialog(false);
    if (updated) {
      fetchData();
    }
  };

  const handleBlock = async () => {
    if (!currentID) return;
    try {
      //   await productService.delete(currentID);
      handleCloseBlockDialog();
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  const handleUnBlock = async () => {
    if (!currentID) return;
    try {
      //   await productService.delete(currentID);
      handleCloseUnBlockDialog();
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  const renderAction = (row: IProduct) => {
    return (
      <>
        <LinkIconButton to={`${row.id}`}>
          <IconButton>
            <VisibilityIcon />
          </IconButton>
        </LinkIconButton>

        <IconButton onClick={handleOpenUpdateDialog(row.id)}>
          <EditIcon />
        </IconButton>

        {row.active ? (
          <IconButton onClick={handleOpenBlockDialog(row.id)}>
            <BlockIcon />
          </IconButton>
        ) : (
          <IconButton onClick={handleOpenUnBlockDialog(row.id)}>
            <CheckIcon />
          </IconButton>
        )}
      </>
    );
  };

  return (
    <TableWrapper sx={{ height: 1 }} component={Paper}>
      <TableSearchField
        title="Danh sách sản phẩm"
        placeHolder="Tìm kiếm sản phẩm"
        onSearch={handleSearch}
        searchText={filters.searchText}
      >
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={handleOpenCreateDialog}
        >
          Thêm mới sản phẩm
        </Button>
      </TableSearchField>

      <TableContent total={productList.length} loading={loading}>
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
                {productList.map((item) => {
                  const { id, name, group, priceBuy, priceSale, active } = item;
                  return (
                    <TableRow hover tabIndex={-1} key={id}>
                      <TableCell>{id}</TableCell>
                      <TableCell>{name}</TableCell>
                      <TableCell>{group}</TableCell>
                      <TableCell>{priceBuy}</TableCell>
                      <TableCell>{priceSale}</TableCell>
                      <TableCell>
                        {active ? (
                          <Button>Có</Button>
                        ) : (
                          <Button color="error">Không</Button>
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
          rowsPerPageOptions={[5, 10, 25, 50, 100]}
        />
      </TableContent>

      <BlockDialog
        id={currentID}
        tableName="sản phẩm"
        name={productList.find((x) => x.id === currentID)?.name}
        onClose={handleCloseBlockDialog}
        open={openBlockDialog}
        handleBlock={handleBlock}
      />

      <UnBlockDialog
        id={currentID}
        tableName="sản phẩm"
        name={productList.find((x) => x.id === currentID)?.name}
        onClose={handleCloseUnBlockDialog}
        open={openUnBlockDialog}
        handleUnBlock={handleUnBlock}
      />

      <FormDialog
        currentID={currentID}
        data={productList.find((x) => x.id === currentID)}
        open={openFormDialog}
        handleClose={handleCloseFormDialog}
      />
    </TableWrapper>
  );
};

export default TableData;
