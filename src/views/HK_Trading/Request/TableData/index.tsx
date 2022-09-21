import DownloadIcon from '@mui/icons-material/Download';
import { LoadingButton } from '@mui/lab';
import { Paper, Stack, Table, TableBody, TableContainer } from '@mui/material';
import { Scrollbar } from 'components/common';
import SelectTime, { ISelectTime } from 'components/Form/SelectTime';
import {
  TableContent,
  TablePagination,
  TableSearchField,
  TableWrapper,
} from 'components/Table';
import { connectURL } from 'config';
import { defaultFilters } from 'constants/defaultFilters';
import { useNotification } from 'hooks';
import 'index.css';
import { IRequestImport } from 'interface';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getImportRequestList } from 'redux/slices/expected';
import expectedService from 'services/expected.service';
import { FilterParams } from 'types';
import TableHeader, { Cells } from '../components/TableHeader';
import ExpandRow from './ExpandRow';

const getCells = (): Cells<IRequestImport> => [
  { id: 'id', label: 'STT' },
  { id: 'id', label: 'Điểm bán' },
  { id: 'id', label: 'Số lượng' },
  { id: 'requestDate', label: 'Ngày yêu cầu' },
];

const TableData = () => {
  const dispatch = useDispatch();
  const setNotification = useNotification();

  const [loading, setLoading] = useState<boolean>(true);
  const [totalRows, setTotalRows] = useState<number>(0);
  const [filters, setFilters] = useState<FilterParams>(defaultFilters);
  const [requestImport, setRequestImport] = useState<object>([]);
  const [open, setOpen] = useState(false);

  const cells = useMemo(() => getCells(), []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSearch = (searchText: string) => {
    setFilters((state) => ({
      ...state,
      searchText,
      pageIndex: 1,
    }));
  };

  const fetchData = async () => {
    //@ts-ignore
    const { payload, error } = await dispatch(getImportRequestList(filters));

    if (error) {
      setNotification({
        error: 'Lỗi!',
      });
      setLoading(false);
      return;
    }
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

  const handleSelectTime = (time: ISelectTime) => {
    setFilters((prev) => ({ ...prev, ...time, pageIndex: 1 }));
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

  const handleDownload = () => {
    handleOpen();

    return expectedService
      .dowLoadFile(filters)
      .then((re: any) => {
        setTimeout(() => {
          const url = `${connectURL}/` + re.data;
          //download_file(url);
          var save = document.createElement('a');
          save.href = url;
          save.target = '_blank';
          var filename = url.substring(url.lastIndexOf('/') + 1);
          save.download = filename;
          if (
            navigator.userAgent.toLowerCase().match(/(ipad|iphone|safari)/) &&
            navigator.userAgent.search('Chrome') < 0
          ) {
            document.location = save.href;
            // window event not working here
          } else {
            var evt = new MouseEvent('click', {
              view: window,
              bubbles: true,
              cancelable: false,
            });
            save.dispatchEvent(evt);
            (window.URL || window.webkitURL).revokeObjectURL(save.href);
          }
          handleClose();
        }, 5000);
      })
      .catch((err) => {
        setNotification({ error: 'xử lý file lỗi!' });
        handleClose();
      });
  };

  return (
    <TableWrapper sx={{ height: 1 }} component={Paper}>
      <div>
        <TableSearchField
          title="Danh sách yêu cầu nhập"
          placeHolder="Tìm kiếm sản phẩm, điểm bán"
          onSearch={handleSearch}
          searchText={filters.searchText}
        ></TableSearchField>
        <SelectTime
          defaultTime={{
            startDate: filters.startDate,
            lastDate: filters.lastDate,
          }}
          onSelectTime={handleSelectTime}
        />
        <Stack alignItems="flex-end" paddingX={1.5}>
          <LoadingButton
            loadingPosition="start"
            startIcon={<DownloadIcon />}
            sx={{ height: '40px', width: '100px' }}
            variant="outlined"
            onClick={handleDownload}
            loading={open}
          >
            PDF
          </LoadingButton>
        </Stack>
      </div>
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
                  // @ts-ignore
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
