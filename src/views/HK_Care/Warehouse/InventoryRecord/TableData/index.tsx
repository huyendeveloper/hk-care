import AddIcon from '@mui/icons-material/Add';
import DownloadIcon from '@mui/icons-material/Download';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {
  Backdrop,
  CircularProgress,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from '@mui/material';
import { LinkButton } from 'components/common';
import Scrollbar from 'components/common/Scrollbar';
import TableContent from 'components/Table/TableContent';
import TableHeader, { Cells } from 'components/Table/TableHeader';
import TablePagination from 'components/Table/TablePagination';
import TableSearchField from 'components/Table/TableSearchField';
import TableWrapper from 'components/Table/TableWrapper';
import { defaultFilters } from 'constants/defaultFilters';
import useNotification from 'hooks/useNotification';
import { IInventoryRecord } from 'interface';
import moment from 'moment';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { ClickEventCurrying, FilterParams } from 'types';
import { numberFormat } from 'utils/numberFormat';

const getCells = (): Cells<IInventoryRecord> => [
  {
    id: 'id',
    label: 'STT',
  },
  {
    id: 'code',
    label: 'Mã biên bản kiểm kê',
  },
  {
    id: 'date',
    label: 'Ngày kiểm kê',
  },
  {
    id: 'staff',
    label: 'Nhân viên kiểm',
  },
  {
    id: 'totalRevenueDiff',
    label: 'Tổng lệch doanh thu',
  },
  {
    id: 'date',
    label: 'Thao tác',
  },
];

const TableData = () => {
  const dispatch = useDispatch();
  const setNotification = useNotification();
  const [loading, setLoading] = useState<boolean>(true);
  const [showBackdrop, setShowBackdrop] = useState<boolean>(false);
  const [filters, setFilters] = useState<FilterParams>(defaultFilters);
  const [totalRows, setTotalRows] = useState<number>(0);
  const [inventoryRecord, setInventoryRecord] = useState<IInventoryRecord[]>(
    []
  );
  const [currentID, setCurrentID] = useState<number | null>(null);
  const [openFormDialog, setOpenFormDialog] = useState<boolean>(false);
  const [disableView, setDisableView] = useState<boolean>(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);

  const cells = useMemo(() => getCells(), []);

  const fetchData = async () => {
    const payload = {
      inventoryRecord: [
        {
          id: 1,
          code: '13537-445',
          date: new Date('8/16/2021'),
          staff: 'Terzo',
          totalRevenueDiff: 87872,
        },
        {
          id: 2,
          code: '36987-2460',
          date: new Date('4/15/2022'),
          staff: 'Davioud',
          totalRevenueDiff: 76375,
        },
        {
          id: 3,
          code: '33992-1307',
          date: new Date('5/5/2022'),
          staff: 'Graber',
          totalRevenueDiff: 18260,
        },
        {
          id: 4,
          code: '51345-115',
          date: new Date('11/8/2021'),
          staff: 'Duffyn',
          totalRevenueDiff: 82972,
        },
        {
          id: 5,
          code: '22431-640',
          date: new Date('9/21/2021'),
          staff: 'Menichino',
          totalRevenueDiff: 55772,
        },
        {
          id: 6,
          code: '0093-7350',
          date: new Date('12/27/2021'),
          staff: 'Adams',
          totalRevenueDiff: 35887,
        },
        {
          id: 7,
          code: '52810-214',
          date: new Date('7/21/2021'),
          staff: 'Woodeson',
          totalRevenueDiff: 83272,
        },
        {
          id: 8,
          code: '50523-489',
          date: new Date('11/17/2021'),
          staff: 'Abrahmer',
          totalRevenueDiff: 36194,
        },
        {
          id: 9,
          code: '59779-404',
          date: new Date('10/15/2021'),
          staff: "O'Hartnedy",
          totalRevenueDiff: 11672,
        },
        {
          id: 10,
          code: '59640-154',
          date: new Date('3/16/2022'),
          staff: 'Costa',
          totalRevenueDiff: 58563,
        },
      ],
      totalCount: 35,
    };

    setInventoryRecord(payload.inventoryRecord);
    setTotalRows(payload.totalCount);
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
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

  const handleOpenCreateDialog = () => {
    setCurrentID(null);
    setOpenFormDialog(true);
    setDisableView(false);
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

  const handleOpenDeleteDialog: ClickEventCurrying = (id) => () => {
    setCurrentID(id);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleCloseFormDialog = () => {
    setOpenFormDialog(false);
  };

  const handleOpenUpdateDialog: ClickEventCurrying = (id) => () => {
    setCurrentID(id);
    setOpenFormDialog(true);
    setDisableView(false);
  };

  const handleOpenViewDialog: ClickEventCurrying = (id) => () => {
    setCurrentID(id);
    setDisableView(true);
    setOpenFormDialog(true);
  };

  const renderAction = (row: IInventoryRecord) => {
    return (
      <>
        <IconButton onClick={handleOpenViewDialog(row.id)}>
          <VisibilityIcon />
        </IconButton>

        <IconButton onClick={handleOpenUpdateDialog(row.id)}>
          <EditIcon />
        </IconButton>
        <IconButton>
          <DownloadIcon />
        </IconButton>
      </>
    );
  };

  return (
    <TableWrapper sx={{ height: 1 }} component={Paper}>
      <TableSearchField
        title="Danh sách bản kiểm kê kho"
        placeHolder="Tìm kiếm bản kiểm kho"
        onSearch={handleSearch}
        searchText={filters.searchText}
        start={filters.startDate}
        end={filters.lastDate}
        setStart={(val) =>
          setFilters({ ...filters, pageIndex: 1, startDate: val })
        }
        setEnd={(val) =>
          setFilters({ ...filters, pageIndex: 1, lastDate: val })
        }
        searchArea
      >
        <LinkButton
          variant="outlined"
          startIcon={<AddIcon />}
          sx={{ fontSize: '1rem' }}
          to="create"
        >
          Thêm bản kiểm kho
        </LinkButton>
      </TableSearchField>

      <TableContent total={inventoryRecord.length} loading={loading}>
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
                {inventoryRecord.map((item, index) => {
                  const { id, code, date, staff, totalRevenueDiff } = item;
                  return (
                    <TableRow hover tabIndex={-1} key={id}>
                      <TableCell>
                        {(filters.pageIndex - 1) * filters.pageSize + index + 1}
                      </TableCell>
                      <TableCell>{code}</TableCell>
                      <TableCell>
                        {moment(date).format('DD/MM/YYYY HH:mm')}
                      </TableCell>
                      <TableCell>{staff}</TableCell>
                      <TableCell>{numberFormat(totalRevenueDiff)}</TableCell>
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

      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={showBackdrop}
        onClick={() => setShowBackdrop(false)}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </TableWrapper>
  );
};

export default TableData;
