import { yupResolver } from '@hookform/resolvers/yup';
import {
  FormGroup,
  Grid,
  Paper,
  Table,
  TableBody,
  TableContainer,
  Typography,
} from '@mui/material';
import { LinkButton, Scrollbar } from 'components/common';
import PageWrapperFullwidth from 'components/common/PageWrapperFullwidth';
import {
  ControllerMultiFile,
  ControllerTextarea,
  ControllerTextField,
  EntitySelecter,
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
import { IReceipt, ITenant } from 'interface';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getImportReceipt } from 'redux/slices/importReceipt';
import tenantService from 'services/tenant.service';
import { FilterParams } from 'types';
import * as yup from 'yup';
import ReceiptEntity from './ReceiptEntity';
import TotalBill from './TotalBill';

const validationSchema = yup.object().shape({});

const getCells = (): Cells<IReceipt> => [
  { id: 'productId', label: 'STT' },
  { id: 'productName', label: 'Tên sản phẩm' },
  { id: 'mesure', label: 'Đơn vị' },
  { id: 'mesure', label: 'Số lượng' },
  { id: 'mesure', label: 'Giá vốn' },
  { id: 'mesure', label: 'Giá trị xuất' },
  { id: 'importPrice', label: 'Số lô' },
  { id: 'price', label: 'Hạn sử dụng' },
];

interface ImportReceipt {
  toTalMoney: number;
  vat: number;
  discountValue: number;
  moneyToPay: number;
  paid: number;
  debts: number;
  description: string;
  pathFile: string;
}

const Details = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const setNotification = useNotification();
  const [receiptProduct, setReceiptProduct] = useState<IReceipt[]>([]);
  const [importReceipt, setImportReceipt] = useState<ImportReceipt>();
  const [totalRows, setTotalRows] = useState<number>(0);
  const [tenantList, setTenantList] = useState<ITenant[]>([]);
  const [loadingTenant, setLoadingTenant] = useState<boolean>(true);

  const [files, setFiles] = useState<File[] | object[]>([
    { name: '23465233827' },
  ]);
  const [filters, setFilters] = useState<FilterParams>({
    ...defaultFilters,
    pageSize: 1000,
  });

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

  const { control, setValue, handleSubmit } = useForm<IReceipt>({
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
    defaultValues: validationSchema.getDefault(),
  });

  const fetchData = async () => {
    tenantService
      .getAll()
      .then(({ data }) => {
        setTenantList(data);
        setLoadingTenant(false);
      })
      .catch((e) => {
        setLoadingTenant(false);
      });
    // @ts-ignore
    const { payload, error } = await dispatch(getImportReceipt(id));

    if (error) {
      setNotification({ error: 'Lỗi!' });
      return;
    }
    setImportReceipt(payload.importReceipt);
    const fileList: object[] = [];
    files &&
      fileList.push({
        name: payload.importReceipt.pathFile
          ? `${connectURL}/${payload.importReceipt.pathFile}`
          : '',
      });
    setFiles(fileList);
    setReceiptProduct(payload.importReceipt.listProductReceiptWH);
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async (payload: IReceipt) => {};

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
                            {receiptProduct.map((item, index) => (
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
                        totalPages={totalRows}
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
                        importReceipt={importReceipt}
                      />
                    </Grid>
                  </Grid>
                </TableWrapper>
              </Grid>

              <Grid item xs={12} md={4}>
                <Typography
                  color="text.secondary"
                  sx={{ mb: 1.5, fontWeight: 'regular', fontSize: '1.74rem' }}
                >
                  Thông tin phiếu chuyển
                </Typography>
                <Grid item xs={12}>
                  <FormLabel title="Điểm bán nhận" name="description" />
                </Grid>
                <Grid item xs={12}>
                  <EntitySelecter
                    name="__tenant"
                    required
                    control={control}
                    options={tenantList}
                    renderLabel={(field) => field.name}
                    placeholder=""
                    noOptionsText="Không tìm thấy điểm bán"
                    loading={loadingTenant}
                    disabled
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormLabel title="Ghi chú" name="description" />
                </Grid>
                <Grid item xs={12}>
                  <ControllerTextarea
                    maxRows={11}
                    minRows={11}
                    name="description"
                    control={control}
                    value={importReceipt?.description}
                    disabled
                  />
                </Grid>
              </Grid>
            </Grid>
          </FormGroup>
        </FormContent>
        <FormFooter>
          <LinkButton to="/hk_care/warehouse/export/circulation_invoice">
            Quay lại
          </LinkButton>
        </FormFooter>
      </FormPaperGrid>
    </PageWrapperFullwidth>
  );
};

export default Details;
