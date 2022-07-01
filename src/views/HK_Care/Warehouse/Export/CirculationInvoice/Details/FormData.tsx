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
  ControllerTextarea,
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
import { defaultFilters } from 'constants/defaultFilters';
import { IExportWHRotation, ITenant } from 'interface';
import { useEffect, useMemo, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import tenantService from 'services/tenant.service';
import { FilterParams } from 'types';
import LocalStorage from 'utils/LocalStorage';
import * as yup from 'yup';
import ReceiptEntity from './ReceiptEntity';
import TotalBill from './TotalBill';

const validationSchema = yup.object().shape({});

interface IProps {
  defaultValue: IExportWHRotation | null;
}

const getCells = (): Cells<IExportWHRotation> => [
  { id: 'code', label: 'STT' },
  { id: 'code', label: 'Tên sản phẩm' },
  { id: 'code', label: 'Đơn vị' },
  { id: 'code', label: 'Số lượng' },
  { id: 'code', label: 'Giá vốn' },
  { id: 'code', label: 'Giá trị xuất' },
];

const Details = ({ defaultValue }: IProps) => {
  const [tenantList, setTenantList] = useState<ITenant[]>([]);
  const [loadingTenant, setLoadingTenant] = useState<boolean>(true);

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

  const { control, setValue, handleSubmit, getValues } =
    useForm<IExportWHRotation>({
      mode: 'onChange',
      resolver: yupResolver(validationSchema),
      defaultValues: defaultValue || validationSchema.getDefault(),
    });

  const fetchTenants = async () => {
    try {
      const { data } = await tenantService.getTenants();
      setTenantList(
        data.filter(
          (item: ITenant) => item.name !== LocalStorage.get('tennant')
        )
      );
      setLoadingTenant(false);
    } catch (error) {
      setLoadingTenant(false);
    }
  };

  useEffect(() => {
    fetchTenants();
  }, []);

  const onSubmit = async (payload: IExportWHRotation) => {};

  const handleOnSort = (field: string) => {
    setFilters((state) => ({
      ...state,
      sortBy: field,
    }));
  };

  const { fields } = useFieldArray<IExportWHRotation>({
    control,
    name: 'exportWHDetails',
  });

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
                            {fields.map((item, index) => (
                              <ReceiptEntity
                                item={item}
                                key={index}
                                index={index}
                                setValue={setValue}
                                getValues={getValues}
                                arrayName="exportWHDetails"
                                control={control}
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
                        totalPages={fields.length}
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
                        getValues={getValues}
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
                    name="rotationPoint"
                    control={control}
                    options={tenantList}
                    renderLabel={(field) => field.name}
                    noOptionsText="Không tìm thấy điểm bán"
                    loading={loadingTenant}
                    placeholder=""
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
