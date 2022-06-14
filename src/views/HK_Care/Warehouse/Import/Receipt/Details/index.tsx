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
  ControllerMultiFile,
  ControllerTextarea,
  FormContent,
  FormFooter,
  FormHeader,
  FormLabel,
  FormPaperGrid,
} from 'components/Form';
import { TableContent, TableHeader, TableWrapper } from 'components/Table';
import { Cells } from 'components/Table/TableHeader';
import { connectURL } from 'config';
import { defaultFilters } from 'constants/defaultFilters';
import { useNotification } from 'hooks';
import { IReceipt } from 'interface';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getImportReceipt } from 'redux/slices/importReceipt';
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
  { id: 'mesure', label: 'Giá nhập' },
  { id: 'mesure', label: 'Giá bán' },
  { id: 'productGroup', label: 'Chiết khấu' },
  { id: 'stockQuantity', label: 'Thành tiền' },
  { id: 'importPrice', label: 'Số lô' },
  { id: 'price', label: 'Số đăng ký' },
  { id: 'price', label: 'Ngày sản xuất' },
  { id: 'mesure', label: 'Hạn dùng' },
  { id: 'mesure', label: '' },
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
  const [files, setFiles] = useState<File[] | object[]>([
    { name: '23465233827' },
  ]);
  const [filters, setFilters] = useState<FilterParams>({
    ...defaultFilters,
    pageSize: 1000,
  });

  const cells = useMemo(() => getCells(), []);

  const { control, setValue, handleSubmit } = useForm<IReceipt>({
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
    defaultValues: validationSchema.getDefault(),
  });

  const fetchData = async () => {
    // @ts-ignore
    const { payload, error } = await dispatch(getImportReceipt(id));

    if (error) {
      setNotification({
        error: 'Lỗi khi tải danh sách sản phẩm!',
      });
      return;
    }
    setImportReceipt(payload.importReceipt);
    const fileList: object[] = [];
    files &&
      fileList.push({
        name: `${connectURL}/${payload.importReceipt.pathFile}`,
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
    <PageWrapperFullwidth title="Thêm hóa đơn">
      <FormPaperGrid onSubmit={handleSubmit(onSubmit)}>
        <FormHeader title="Thông tin sản phẩm" />
        <FormContent>
          <FormGroup>
            <Grid container spacing={2}>
              <Grid item xs={12} sx={{ minHeight: '200px' }}>
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
                </TableWrapper>
              </Grid>
              <Grid container alignItems="center">
                <Grid item lg={9} xs={0}></Grid>
                <Grid item lg={3} xs={12} p={2}>
                  <TotalBill
                    control={control}
                    setValue={setValue}
                    importReceipt={importReceipt}
                  />
                </Grid>
              </Grid>
              <Grid item xs={12} md={6}>
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
              <Grid item xs={12} md={6}>
                <Grid item xs={12}>
                  <FormLabel title="Tài liệu đính kèm" name="description" />
                </Grid>
                <Grid item xs={12}>
                  <ControllerMultiFile
                    files={files}
                    setFiles={setFiles}
                    max={1}
                    viewOnly
                  />
                </Grid>
              </Grid>
            </Grid>
          </FormGroup>
        </FormContent>
        <FormFooter>
          <LinkButton to="/hk_care/warehouse/import/receipt">
            Quay lại
          </LinkButton>
        </FormFooter>
      </FormPaperGrid>
    </PageWrapperFullwidth>
  );
};

export default Details;
