import { yupResolver } from '@hookform/resolvers/yup';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { LoadingButton } from '@mui/lab';
import {
  Button,
  Grid,
  Paper,
  Stack,
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
  Selecter,
} from 'components/Form';
import { TableContent, TablePagination, TableWrapper } from 'components/Table';
import TableHeader, { Cells } from 'components/Table/TableHeader';
import { defaultFilters } from 'constants/defaultFilters';
import { useNotification } from 'hooks';
import {
  IInventoryRecord,
  IInventoryRecordProduct,
  IInventoryRecordProductShow,
} from 'interface';
import { useEffect, useMemo, useState } from 'react';
import { useFieldArray, useForm, useWatch } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { createWhInventory } from 'redux/slices/whInventory';
import importReceiptService from 'services/importReceipt.service';
import whInventoryService from 'services/whInventory.service';
import { FilterParams } from 'types';
import { numberFormat } from 'utils/numberFormat';
import * as yup from 'yup';
import MapDialog from './MapDialog';
import ReceiptEntity from './ReceiptEntity';

interface IDetailAdd {
  idProduct: number | null;
  idGroupProduct: number | null;
}

interface ISelect {
  id: number;
  name: string;
}

const getCells = (): Cells<IInventoryRecordProductShow> => [
  { id: 'id', label: 'STT' },
  { id: 'name', label: 'Tên sản phẩm' },
  { id: 'unit', label: 'Đơn Vị' },
  {
    id: 'amountOld',
    label: (
      <>
        Tồn
        <br />
        Trên máy
      </>
    ),
  },
  {
    id: 'amountNew',
    label: (
      <>
        Tồn
        <br />
        Thực tế
      </>
    ),
  },
  { id: 'quantityDifference', label: 'Chênh lệnh' },
  { id: 'priceImport', label: 'Giá nhập' },
  { id: 'moneyDifference', label: 'Tiền lệch' },
  { id: 'priceExport', label: 'Giá bán' },
  { id: 'estimatedRevenue', label: 'Doanh thu dự tính' },
];

const validationSchema = yup.object().shape({});

const Create = () => {
  const { id, v } = useParams();
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

  const items = useWatch({
    control,
    name: `items`,
  });

  useEffect(() => {
    getNameProduct();
    getGroupProduct();
    _initScreen();
  }, []);

  const _initScreen = () => {
    if (id) {
      setLoading(true);
      whInventoryService
        .detailInventoryWH(id)
        .then((data: any) => {
          var result = data.data;
          if (result.statusCode === 400) {
            setNotification({ error: data.data });
          } else if (result.statusCode === 200 && result.data.length === 0) {
            setNotification({ error: 'Không có sản phẩm nào!' });
            setLoading(false);
            return;
          } else {
            setLoading(true);
            setFiles(
              result.data.fileAttach === null
                ? []
                : [{ name: result.data.fileAttach[0] }]
            );
            console.log('data.data', result.data.items);
            setValue('note', result.data.note);
            result.data.items.forEach((item: any) => {
              // @ts-ignore
              if (!fields.some((e) => e.productId === item.productId)) {
                if (id) {
                  // @ts-ignore
                  append({ ...item, productId: item.productId });
                } else {
                  // @ts-ignore
                  append({ ...item, productId: item.productId });
                }
              }
            });
            setFilters({ ...filters, sortBy: '' });
            setLoading(false);
          }
        })
        .catch((err) => {
          setNotification({ error: 'Có lỗi xảy ra. Vui lòng thử lại!' });
          setLoading(false);
        });
    }
  };

  const addProduct = async () => {
    setLoadingAdd(true);
    try {
      const { data } = await whInventoryService.getwhInventory(detailAdd);
      if (data.statusCode === 400) {
        setNotification({ error: data.data });
      } else if (data.statusCode === 200 && data.data.length === 0) {
        setNotification({ error: 'Không có sản phẩm nào!' });
        setLoadingAdd(false);
        return;
      } else {
        if (data.data == undefined) {
          setNotification({ error: 'Không có sản phẩm nào!' });
        } else {
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
        }
      }
    } catch (error) {
      setNotification({ error: 'Có lỗi xảy ra. Vui lòng thử lại!' });
      setLoadingAdd(false);
    }
    setLoadingAdd(false);
  };

  const handleCloseDialog = () => {
    setOpenMapDialog(false);
  };

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
    //[vi] Khởi tạo file
    let file = '';
    if (files[0] instanceof File && files !== null && files !== undefined) {
      const { data } = await importReceiptService.getPathFileReceipt(files[0]);
      file = data;
    } else if (
      typeof files[0] === 'object' &&
      files !== null &&
      files !== undefined
    ) {
      file = (files[0] as any).name as string;
    }

    setLoading(true);
    const UPDATEAD = '1';
    const newPayload = { ...body, fileAttach: [file] };
    if (id === undefined && v === undefined) {
      whInventoryService
        .create(newPayload)
        .then((rs) => {
          setNotification({
            message: 'Thêm thành công',
            severity: 'success',
          });
          setLoading(false);
          return navigate('/hk_care/warehouse/inventory_record');
        })
        .catch((err) => {
          setNotification({ error: 'Lỗi!' });
          setLoading(false);
          return;
        });
    }

    //[vi] kiem tra man hinh viewer
    if (id !== undefined && v === UPDATEAD) {
      whInventoryService
        .update(newPayload, id)
        .then((rs) => {
          setLoading(false);
          setNotification({
            message: 'Sửa thành công',
            severity: 'success',
          });
          return navigate('/hk_care/warehouse/inventory_record');
        })
        .catch((err) => {
          setNotification({ error: 'Lỗi!' });
          setLoading(false);
          return;
        });
    } else {
      setLoading(false);
      return navigate(`/hk_care/warehouse/inventory_record`);
    }
  };

  const pageTitle = useMemo(() => {
    if (!id) {
      return 'Danh sách sản phẩm';
    }
    if (v === '0') {
      return 'Chi tiết biên bản kiểm kê';
    }
    return 'Chỉnh sửa biên bản kiểm kê';
  }, [id, v]);

  return (
    <PageWrapperFullwidth title={pageTitle}>
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
          <FormHeader title={pageTitle} />
          <FormContent>
            {v !== '0' && (
              <Grid container spacing={2} mb={2} alignItems="flex-end">
                <Grid item xs={12} md={5}>
                  <FormLabel title="Tìm kiếm sản phẩm" name="name" />
                  <Selecter
                    renderValue="id"
                    options={productList}
                    renderLabel={(field) => field.name}
                    noOptionsText="Không tìm thấy sản phẩm"
                    placeholder=""
                    disabled={v === '0'}
                    onChangeSelect={(value: number | null) =>
                      setDetailAdd({ ...detailAdd, idProduct: value })
                    }
                    defaultValue=""
                    loading={loading}
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
                    disabled={v === '0'}
                    onChangeSelect={(value: number | null) =>
                      setDetailAdd({ ...detailAdd, idGroupProduct: value })
                    }
                    defaultValue=""
                    loading={loading}
                  />
                </Grid>
                <Grid item xs={12} md={2}>
                  <LoadingButton
                    onClick={addProduct}
                    loading={loadingAdd}
                    disabled={v === '0'}
                    loadingPosition="start"
                    startIcon={<></>}
                    sx={{ height: '40px', width: '100px', float: 'right' }}
                  >
                    Kiểm kê
                  </LoadingButton>
                </Grid>
              </Grid>
            )}

            <Grid item xs={12} gap={2}>
              <TableWrapper sx={{ height: 1, mb: 2 }} component={Paper}>
                <TableContent total={10} noDataText=" " loading={loading}>
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
                              (filters.pageIndex - 1) * filters.pageSize,
                              filters.pageSize
                            )
                            .map((item, index) => {
                              return (
                                <ReceiptEntity
                                  show={v === '0'}
                                  product={item}
                                  remove={remove}
                                  index={
                                    (filters.pageIndex - 1) * filters.pageSize +
                                    index
                                  }
                                  key={
                                    (filters.pageIndex - 1) * filters.pageSize +
                                    index
                                  }
                                  setValue={setValue}
                                  control={control}
                                  arrayName="items"
                                />
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
                        items === undefined
                          ? 0
                          : items.reduce(
                              (pre: any, cur: any) =>
                                pre +
                                cur.priceExport *
                                  (cur.amountOld - cur.amountNew),
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
                    disabled={v === '0'}
                    maxRows={11}
                    minRows={11}
                    name="note"
                    control={control}
                  />
                </Grid>
                <Grid item xs={12} md={6} pl={2}>
                  <FormLabel title="File đính kèm" name="file" />
                  <ControllerMultiFile
                    viewOnly={v === '0'}
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
              {v !== '0' ? 'Hủy' : 'Quay lại'}
            </LinkButton>
            {v !== '0' && (
              <LoadingButton type="submit" loading={loading}>
                {id ? 'Lưu' : 'Chốt kiểm kê'}
              </LoadingButton>
            )}
          </FormFooter>
        </FormPaperGrid>
      </Stack>
      <MapDialog open={openMapDialog} onClose={handleCloseDialog} />
    </PageWrapperFullwidth>
  );
};

export default Create;
