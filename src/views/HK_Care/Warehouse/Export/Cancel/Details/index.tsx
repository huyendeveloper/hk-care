import { yupResolver } from '@hookform/resolvers/yup';
import {
  FormGroup,
  Grid,
  Paper,
  Table,
  TableBody,
  TableContainer,
} from '@mui/material';
import { LinkButton, Scrollbar } from 'components/common';
import PageWrapperFullwidth from 'components/common/PageWrapperFullwidth';
import {
  ControllerTextarea,
  FormContent,
  FormFooter,
  FormHeader,
  FormLabel,
  FormPaperGrid,
} from 'components/Form';
import {
  TableContent,
  TableHeader,
  TablePagination,
  TableWrapper,
} from 'components/Table';
import { Cells } from 'components/Table/TableHeader';
import { connectURL } from 'config';
import { defaultFilters } from 'constants/defaultFilters';
import { useNotification } from 'hooks';
import { IExportCancel, IProductExportCancel } from 'interface';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getGetDetail } from 'redux/slices/exportCancel';
import { FilterParams } from 'types';
import * as yup from 'yup';
import ReceiptEntity from './ReceiptEntity';
import TotalBill from './TotalBill';

const validationSchema = yup.object().shape({});

const getCells = (): Cells<IExportCancel> => [
  { id: 'code', label: 'STT' },
  { id: 'code', label: 'Tên SP' },
  { id: 'code', label: 'Đ.Vị' },
  { id: 'code', label: 'SL' },
  { id: 'code', label: 'Giá vốn' },
  { id: 'code', label: 'Giá trị hủy' },
  { id: 'code', label: 'Số lô' },
  { id: 'creationTime', label: 'Ngày nhập' },
  { id: 'code', label: 'HSD' },
];

const Details = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const setNotification = useNotification();
  const [receiptProduct, setReceiptProduct] = useState<IProductExportCancel[]>(
    []
  );
  const [exportCancel, setImportReceipt] = useState<IExportCancel>();
  const [totalRows, setTotalRows] = useState<number>(0);
  const [files, setFiles] = useState<File[] | object[]>([
    { name: '23465233827' },
  ]);
  const [filters, setFilters] = useState<FilterParams>(defaultFilters);

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

  const cells = useMemo(() => getCells(), []);

  const { control, setValue, handleSubmit } = useForm<IExportCancel>({
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
    defaultValues: validationSchema.getDefault(),
  });

  const fetchData = async () => {
    // @ts-ignore
    const { payload, error } = await dispatch(getGetDetail(id));

    if (error) {
      setNotification({
        error: 'Lỗi!',
      });
      return;
    }
    setImportReceipt(payload.exportCancel);
    const fileList: object[] = [];
    files &&
      fileList.push({
        name: payload.exportCancel.pathFile
          ? `${connectURL}/${payload.exportCancel.pathFile}`
          : '',
      });
    setFiles(fileList);
    setReceiptProduct(payload.exportCancel.exportWHDetails);
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async (payload: IExportCancel) => {};

  const handleOnSort = (field: string) => {
    setFilters((state) => ({
      ...state,
      sortBy: field,
    }));
  };

  return (
    <PageWrapperFullwidth title="Thông tin hóa đơn">
      <FormPaperGrid height="fit-content" onSubmit={handleSubmit(onSubmit)}>
        <FormHeader title="Thông tin sản phẩm" />
        <FormContent>
          <FormGroup>
            <Grid container spacing={2}>
              <Grid item xs={12} md={8} sx={{ minHeight: '200px' }}>
                <TableWrapper sx={{ height: 1 }} component={Paper}>
                  <TableContent total={1} noDataText=" " loading={false}>
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
                            {[...receiptProduct]
                              .splice(
                                (filters.pageIndex - 1) * 10,
                                filters.pageIndex * 10
                              )
                              .map((item, index) => (
                                <ReceiptEntity
                                  key={index}
                                  item={item}
                                  index={index}
                                  value={item}
                                />
                              ))}
                          </TableBody>
                        </Table>
                      </Scrollbar>
                    </TableContainer>
                  </TableContent>
                  <Grid container alignItems="center">
                    <Grid item xs={12}>
                      <TablePagination
                        pageIndex={filters.pageIndex}
                        totalPages={receiptProduct.length}
                        onChangePage={handleChangePage}
                        onChangeRowsPerPage={handleChangeRowsPerPage}
                        rowsPerPage={filters.pageSize}
                        rowsPerPageOptions={[10, 20, 30, 40, 50]}
                      />
                    </Grid>
                    <Grid item lg={8} xs={0}></Grid>
                    <Grid item lg={4} xs={12} p={2}>
                      <TotalBill
                        control={control}
                        setValue={setValue}
                        exportCancel={exportCancel}
                      />
                    </Grid>
                  </Grid>
                </TableWrapper>
              </Grid>

              <Grid item xs={12} md={4}>
                <Grid item xs={12}>
                  <FormLabel title="Ghi chú" name="description" />
                </Grid>
                <Grid item xs={12}>
                  <ControllerTextarea
                    maxRows={11}
                    minRows={11}
                    name="description"
                    control={control}
                    value={exportCancel?.description}
                    disabled
                  />
                </Grid>
              </Grid>
            </Grid>
          </FormGroup>
        </FormContent>
        <FormFooter>
          <LinkButton to="/hk_care/warehouse/export/cancel">
            Quay lại
          </LinkButton>
        </FormFooter>
      </FormPaperGrid>
    </PageWrapperFullwidth>
  );
};

export default Details;
