import { yupResolver } from '@hookform/resolvers/yup';
import CloseIcon from '@mui/icons-material/Close';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { LoadingButton } from '@mui/lab';
import {
  Button,
  Grid,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
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
  Selecter,
} from 'components/Form';
import { TableContent, TablePagination, TableWrapper } from 'components/Table';
import TableHeader, { Cells } from 'components/Table/TableHeader';
import { defaultFilters } from 'constants/defaultFilters';
import { useNotification } from 'hooks';
import { IInventoryRecord, IInventoryRecordProduct } from 'interface';
import { useEffect, useMemo, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { createWhInventory } from 'redux/slices/whInventory';
import importReceiptService from 'services/importReceipt.service';
import whInventoryService from 'services/whInventory.service';
import { FilterParams } from 'types';
import { numberFormat } from 'utils/numberFormat';
import * as yup from 'yup';
import MapDialog from './MapDialog';

interface IDetailAdd {
  idProduct: number | null;
  idGroupProduct: number | null;
}

interface ISelect {
  id: number;
  name: string;
}

const getCells = (): Cells<IInventoryRecordProduct> => [
  { id: 'id', label: 'STT' },
  { id: 'id', label: '' },
  { id: 'id', label: 'Tên SP' },
  { id: 'id', label: 'Đ.Vị' },
  {
    id: 'id',
    label: (
      <>
        Tồn
        <br />
        TM
      </>
    ),
  },
  {
    id: 'id',
    label: (
      <>
        Tồn
        <br />
        TT
      </>
    ),
  },
  { id: 'id', label: 'C.L' },
  { id: 'id', label: 'Giá nhập' },
  { id: 'id', label: 'Tiền lệch' },
  { id: 'id', label: 'Giá bán' },
  { id: 'id', label: 'D.T.dự tính' },
];

const validationSchema = yup.object().shape({});

const Create = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const setNotification = useNotification();

  const [filters, setFilters] = useState<FilterParams>(defaultFilters);
  const [productList, setProductList] = useState<ISelect[]>([]);
  const [productGroupList, setProductGroupList] = useState<ISelect[]>([]);
  const [files, setFiles] = useState<File[] | object[]>([]);
  const [openMapDialog, setOpenMapDialog] = useState<boolean>(false);
  const [loadingAdd, setLoadingAdd] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const [detailAdd, setDetailAdd] = useState<IDetailAdd>({
    idProduct: null,
    idGroupProduct: null,
  });

  const cells = useMemo(() => getCells(), []);

  const { control, setValue, getValues, handleSubmit, reset } =
    useForm<IInventoryRecord>({
      mode: 'onChange',
      resolver: yupResolver(validationSchema),
      defaultValues: validationSchema.getDefault(),
    });

  const { fields, append, remove } = useFieldArray<IInventoryRecord>({
    control,
    // @ts-ignore
    name: `items`,
  });

  const handleOnSort = (field: string) => {
    setFilters((state) => ({
      ...state,
      sortBy: field,
      sortDirection: state.sortDirection === 'asc' ? 'desc' : 'asc',
    }));
  };

  const getNameProduct = () => {
    whInventoryService
      .getNameProduct()
      .then(({ data }) => {
        setProductList(data.data);
      })
      .catch((err) => {})
      .finally(() => {});
  };

  const getGroupProduct = () => {
    whInventoryService
      .getGroupProduct()
      .then(({ data }) => {
        setProductGroupList(data.data);
      })
      .catch((err) => {})
      .finally(() => {});
  };

  useEffect(() => {
    getNameProduct();
    getGroupProduct();
  }, []);

  const addProduct = async () => {
    setLoadingAdd(true);
    try {
      const { data } = await whInventoryService.getwhInventory(detailAdd);
      if (data.data.length === 0) {
        setNotification({ error: 'Không có sản phẩm nào!' });
        setLoadingAdd(false);
        return;
      }
      data.data.forEach((item: any) => {
        // @ts-ignore
        if (!fields.some((e) => e.productId === item.productId)) {
          if (id) {
            // @ts-ignore
            append({ ...item, productId: item.id, id: 0 });
          } else {
            // @ts-ignore
            append({ ...item, productId: item.productId });
          }
        }
      });
      setFilters({ ...filters, sortBy: '' });
    } catch (error) {
      setNotification({ error: 'Lỗi!' });
      setLoadingAdd(false);
    }
    setLoadingAdd(false);
  };

  const handleCloseDialog = () => {
    setOpenMapDialog(false);
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

  const onSubmit = async (body: IInventoryRecord) => {
    let file = '';

    if (files.length > 0) {
      const { data } = await importReceiptService.getPathFileReceipt(files[0]);
      file = data;
    }
    setLoading(true);
    const newPayload = { ...body, fileAttach: [file] };
    if (id) {
      // const { error } = await dispatch(
      //   // @ts-ignore
      //   updateExportCancel({ ...newPayload, id })
      // );
      // if (error) {
      //   setNotification({ error: 'Lỗi!' });
      //   setLoading(false);
      //   return;
      // }
      // setNotification({
      //   message: 'Cập nhật thành công',
      //   severity: 'success',
      // });
      // setLoading(false);
      // return navigate(`/hk_care/warehouse/export/cancel`);
    }
    const { error } = await dispatch(
      // @ts-ignore
      createWhInventory(newPayload)
    );
    if (error) {
      setNotification({ error: 'Lỗi!' });
      setLoading(false);
      return;
    }
    setNotification({
      message: 'Thêm thành công',
      severity: 'success',
    });
    setLoading(false);
    return navigate('/hk_care/warehouse/inventory_record');
  };

  return (
    <PageWrapperFullwidth title={id ? 'Cập nhật hóa đơn' : 'Thêm bản kiểm kho'}>
      <Stack gap={2}>
        <Stack
          flexDirection="row"
          alignItems="flex-start"
          justifyContent="flex-end"
          height="min-content"
        >
          <Button onClick={() => setOpenMapDialog(true)}>
            <LocationOnIcon />
            Sơ đồ kệ thuốc
          </Button>
        </Stack>
        <FormPaperGrid onSubmit={handleSubmit(onSubmit)}>
          <FormHeader title="Danh sách sản phẩm" />
          <FormContent>
            <Grid container spacing={2} mb={2} alignItems="flex-end">
              <Grid item xs={12} md={5}>
                <FormLabel title="Tìm kiếm sản phẩm" name="name" />
                <Selecter
                  renderValue="id"
                  options={productList}
                  renderLabel={(field) => field.name}
                  noOptionsText="Không tìm thấy sản phẩm"
                  placeholder=""
                  onChangeSelect={(value: number | null) =>
                    setDetailAdd({ ...detailAdd, idProduct: value })
                  }
                  defaultValue=""
                  loading={false}
                />
              </Grid>
              <Grid item xs={12} md={5}>
                <FormLabel title="Chọn nhóm sản phẩm" name="name" />
                <Selecter
                  renderValue="id"
                  options={productGroupList}
                  renderLabel={(field) => field.name}
                  noOptionsText="Không tìm thấy nhóm sản phẩm"
                  placeholder=""
                  onChangeSelect={(value: number | null) =>
                    setDetailAdd({ ...detailAdd, idGroupProduct: value })
                  }
                  defaultValue=""
                  loading={false}
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <LoadingButton
                  onClick={addProduct}
                  loading={loadingAdd}
                  loadingPosition="start"
                  startIcon={<></>}
                  sx={{ height: '40px', width: '100px', float: 'right' }}
                >
                  Kiểm kê
                </LoadingButton>
              </Grid>
            </Grid>

            <Grid item xs={12} gap={2}>
              <TableWrapper sx={{ height: 1, mb: 2 }} component={Paper}>
                <TableContent total={1} noDataText=" " loading={false}>
                  <TableContainer sx={{ p: 1.5, minHeight: '40vh' }}>
                    <Scrollbar>
                      <Table sx={{ minWidth: 'max-content' }} size="small">
                        <TableHeader
                          cells={cells}
                          onSort={handleOnSort}
                          sortDirection={filters.sortDirection}
                          sortBy={filters.sortBy}
                        />

                        <TableBody>
                          {[...fields]
                            .splice(
                              (filters.pageIndex - 1) * 10,
                              filters.pageIndex * 10
                            )
                            .map((item, index) => {
                              const {
                                name,
                                unit,
                                amountOld,
                                amountNew,
                                priceImport,
                                priceExport,
                              } = item;
                              return (
                                <TableRow hover tabIndex={-1} key={index}>
                                  <TableCell>{index + 1}</TableCell>
                                  <TableCell
                                    sx={{ padding: 0, width: 'fit-content' }}
                                  >
                                    <IconButton
                                      sx={{ mr: 0.5, p: 0 }}
                                      color="inherit"
                                      onClick={() => remove(index)}
                                    >
                                      <CloseIcon />
                                    </IconButton>
                                  </TableCell>
                                  <TableCell>{name}</TableCell>
                                  <TableCell>{unit}</TableCell>
                                  <TableCell>
                                    {numberFormat(amountOld)}
                                  </TableCell>
                                  <TableCell>
                                    {numberFormat(amountNew)}
                                  </TableCell>
                                  <TableCell>
                                    {numberFormat(amountOld - amountNew)}
                                  </TableCell>
                                  <TableCell>
                                    {numberFormat(priceImport)}
                                  </TableCell>
                                  <TableCell>
                                    {numberFormat(
                                      priceImport * (amountOld - amountNew)
                                    )}
                                  </TableCell>
                                  <TableCell>
                                    {numberFormat(priceExport)}
                                  </TableCell>
                                  <TableCell>
                                    {numberFormat(
                                      priceExport * (amountOld - amountNew)
                                    )}
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                        </TableBody>
                      </Table>
                    </Scrollbar>
                  </TableContainer>
                  <Grid container alignItems="center">
                    <Grid item xs={12}>
                      <TablePagination
                        pageIndex={filters.pageIndex}
                        totalPages={fields.length}
                        onChangePage={handleChangePage}
                        onChangeRowsPerPage={handleChangeRowsPerPage}
                        rowsPerPage={filters.pageSize}
                        rowsPerPageOptions={[10, 20, 30, 40, 50]}
                      />
                    </Grid>
                  </Grid>
                </TableContent>
              </TableWrapper>
              <table style={{ float: 'right' }}>
                <tbody>
                  <tr>
                    <td style={{ paddingRight: '50px' }}>
                      Tổng lệch doanh thu:
                    </td>
                    <td>
                      {numberFormat(
                        [...fields].reduce(
                          (pre, cur) =>
                            pre +
                            cur.priceExport * (cur.amountOld - cur.amountNew),
                          0
                        )
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
              <Grid container>
                <Grid item xs={12} md={6} pr={2}>
                  <FormLabel title="Ghi chú" name="note" />
                  <ControllerTextarea
                    maxRows={11}
                    minRows={11}
                    name="note"
                    control={control}
                  />
                </Grid>
                <Grid item xs={12} md={6} pl={2}>
                  <FormLabel title="File đính kèm" name="note" />
                  <ControllerMultiFile
                    files={files}
                    setFiles={setFiles}
                    max={1}
                    accept="image/*,application/pdf"
                    message="Tài liệu đính kèm chỉ cho phép file pdf và ảnh."
                  />
                </Grid>
              </Grid>
            </Grid>
          </FormContent>
          <FormFooter>
            <LinkButton to="/hk_care/warehouse/inventory_record">
              Hủy
            </LinkButton>
            <LoadingButton type="submit" loading={loading}>
              {id ? 'Lưu' : 'Chốt kiểm kê'}
            </LoadingButton>
          </FormFooter>
        </FormPaperGrid>
      </Stack>
      <MapDialog open={openMapDialog} onClose={handleCloseDialog} />
    </PageWrapperFullwidth>
  );
};

export default Create;
