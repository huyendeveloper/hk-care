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
import { LinkButton, LinkIconButton, Scrollbar } from 'components/common';
import {
  TableContent,
  TablePagination,
  TableSearchField,
  TableWrapper,
} from 'components/Table';
import TableHeader, { Cells } from 'components/Table/TableHeader';
import { defaultFilters } from 'constants/defaultFilters';
import { useNotification } from 'hooks';
import { IUser } from 'interface';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllUser } from 'redux/slices/user';
import { RootState } from 'redux/store';
import { ClickEventCurrying, FilterParams } from 'types';

const getCells = (): Cells<IUser> => [
  { id: 'id', label: 'STT' },
  { id: 'name', label: 'Họ và tên' },
  { id: 'phone', label: 'Số điện thoại' },
  { id: 'role', label: 'Vai trò' },
  { id: 'isActive', label: 'Trạng thái' },
  { id: 'isActive', label: 'Thao tác' },
];

const getCellsAdminCare = (): Cells<IUser> => [
  { id: 'id', label: 'STT' },
  { id: 'name', label: 'Họ và tên' },
  { id: 'phone', label: 'Số điện thoại' },
  { id: 'role', label: 'Vai trò' },
  { id: 'tenant', label: 'Điểm bán' },
  { id: 'isActive', label: 'Trạng thái' },
  { id: 'isActive', label: 'Thao tác' },
];

const TableData = () => {
  const dispatch = useDispatch();
  const setNotification = useNotification();
  const [filters, setFilters] = useState<FilterParams>(defaultFilters);
  const [currentID, setCurrentID] = useState<number | null>(null);
  const [userList, setUserList] = useState<IUser[]>([]);
  const [totalRows, setTotalRows] = useState<number>(0);
  const [openBlockDialog, setOpenBlockDialog] = useState<boolean>(false);
  const [openUnBlockDialog, setOpenUnBlockDialog] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const { userRoles } = useSelector((state: RootState) => state.auth);

  const cells = useMemo(
    () => (userRoles.includes('hkl2') ? getCellsAdminCare() : getCells()),
    [userRoles]
  );

  const fetchData = async () => {
    // setUserList([
    //   {
    //     id: 1,
    //     name: 'Jeth',
    //     phone: '7034887175',
    //     role: 'Electrician',
    //     tenant: 'Gigashots',
    //     status: false,
    //   },
    //   {
    //     id: 2,
    //     name: 'Edie',
    //     phone: '4611020964',
    //     role: 'Construction Expeditor',
    //     tenant: 'Skyble',
    //     status: false,
    //   },
    //   {
    //     id: 3,
    //     name: 'Nell',
    //     phone: '6794000846',
    //     role: 'Project Manager',
    //     tenant: 'Realbuzz',
    //     status: true,
    //   },
    //   {
    //     id: 4,
    //     name: 'Emelia',
    //     phone: '4652709644',
    //     role: 'Subcontractor',
    //     tenant: 'Eidel',
    //     status: false,
    //   },
    //   {
    //     id: 5,
    //     name: 'Edwin',
    //     phone: '3126986142',
    //     role: 'Construction Worker',
    //     tenant: 'Bluejam',
    //     status: false,
    //   },
    //   {
    //     id: 6,
    //     name: 'Nalani',
    //     phone: '8209306276',
    //     role: 'Construction Worker',
    //     tenant: 'Nlounge',
    //     status: true,
    //   },
    //   {
    //     id: 7,
    //     name: 'Nikkie',
    //     phone: '9837242081',
    //     role: 'Surveyor',
    //     tenant: 'Yamia',
    //     status: true,
    //   },
    // ]);
    // setTotalRows(33);
    // @ts-ignore

    // @ts-ignore
    const { payload, error } = await dispatch(getAllUser(filters));
    console.log('payload', payload);
    if (error) {
      setNotification({
        error: 'Lỗi!',
      });
      setLoading(false);
      return;
    }
    setUserList(payload.userList);
    setTotalRows(payload.totalCount);
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    fetchData();
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

  const handleOpenBlockDialog: ClickEventCurrying = (id) => () => {
    setCurrentID(id);
    setOpenBlockDialog(true);
  };

  const handleOpenUnBlockDialog: ClickEventCurrying = (id) => () => {
    setCurrentID(id);
    setOpenUnBlockDialog(true);
  };

  const renderAction = (row: IUser) => {
    return (
      <>
        <LinkIconButton to={`${row.id}`}>
          <IconButton>
            <VisibilityIcon />
          </IconButton>
        </LinkIconButton>
        <LinkIconButton to={`${row.id}/update`}>
          <IconButton>
            <EditIcon />
          </IconButton>
        </LinkIconButton>

        {row.isActive ? (
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
        title="Danh sách người dùng"
        placeHolder="Tìm kiếm người dùng"
        onSearch={handleSearch}
        searchText={filters.searchText}
      >
        <LinkButton
          variant="outlined"
          startIcon={<AddIcon />}
          sx={{ fontSize: '1rem' }}
          to="create"
        >
          Thêm mới người dùng
        </LinkButton>
      </TableSearchField>
      <TableContent total={userList.length} loading={loading}>
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
                {userList.map((item, index) => {
                  const { id, name, phone, role, tenant, isActive } = item;
                  return (
                    <TableRow hover tabIndex={-1} key={id}>
                      <TableCell>
                        {(filters.pageIndex - 1) * filters.pageSize + index + 1}
                      </TableCell>
                      <TableCell>{name}</TableCell>
                      <TableCell>{phone}</TableCell>
                      <TableCell>{role}</TableCell>
                      {userRoles.includes('hkl2') && (
                        <TableCell>{tenant}</TableCell>
                      )}
                      <TableCell>
                        {isActive ? (
                          <Button>Hoạt động</Button>
                        ) : (
                          <Button color="error">Không hoạt động</Button>
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
    </TableWrapper>
  );
};

export default TableData;
