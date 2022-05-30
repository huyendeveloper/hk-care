import { yupResolver } from '@hookform/resolvers/yup';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box, Tab, useMediaQuery, useTheme } from '@mui/material';
import { getValue } from '@testing-library/user-event/dist/utils';
import { LinkButton, LoadingScreen, PageWrapper } from 'components/common';
import { FormFooter, FormHeader, FormPaperGrid } from 'components/Form';
import { useMounted } from 'hooks';
import { ISupplier } from 'interface';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import supplierService from 'services/supplier.service';
import * as yup from 'yup';
import TableData from '../../ProductList/TableData';
import FormDialog from '../FormDialog';
import Details from './Details';

const validationSchema = yup.object().shape({
  name: yup
    .string()
    .required('Vui lòng nhập tên nhà cung cấp.')
    .strict(true)
    .default(''),
  description: yup.string().strict(true).default(''),
});

const DetailsForm = () => {
  const { id: crudId } = useParams();
  const mounted = useMounted();
  const [supplier, setSupplier] = useState<ISupplier>();
  const [taskQueue, setTaskQueue] = useState<number>(0);
  const [openFormDialog, setOpenFormDialog] = useState<boolean>(false);
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down('md'));
  const [fileValue, setFileValue] = useState<File | object>();
  const [tab, setTab] = useState<string>('1');

  const { control, setValue, getValues } = useForm<ISupplier>({
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
    defaultValues: validationSchema.getDefault(),
  });

  const fetchData = () => {
    if (!crudId) return;

    setTaskQueue((task) => task + 1);
    supplierService
      .get(Number(crudId))
      .then(({ data }) => setSupplier(data))
      .catch((error) => console.error(error))
      .finally(() => {
        if (mounted.current) {
          setTaskQueue((task) => task - 1);
        }
      });
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [crudId]);

  const getFile = async (bussinessLicense: string) => {
    const { data } = await supplierService.getFile(bussinessLicense);
    setFileValue({ name: data });
  };

  useEffect(() => {
    if (!supplier) return;

    const {
      id,
      name,
      address,
      nameContact,
      telephoneNumber,
      mobileNumber,
      description,
      fax,
      taxCode,
      bussinessLicense,
      active,
    } = supplier;

    setValue('id', id);
    setValue('name', name);
    setValue('address', address);
    setValue('nameContact', nameContact);
    setValue('telephoneNumber', telephoneNumber);
    setValue('mobileNumber', mobileNumber);
    setValue('description', description);
    setValue('fax', fax);
    setValue('taxCode', taxCode);
    setValue('active', active);
    if (bussinessLicense) {
      getFile(bussinessLicense);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supplier]);

  if (taskQueue > 0) {
    return <LoadingScreen />;
  }

  const handleOpenUpdateDialog = () => {
    setOpenFormDialog(true);
  };

  const handleCloseUpdateDialog = () => {
    setOpenFormDialog(false);
    fetchData();
  };

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setTab(newValue);
  };

  return (
    <PageWrapper title="Nhà cung cấp">
      <FormPaperGrid noValidate>
        <FormHeader title="Xem chi tiết nhà cung cấp" />
        <Box sx={{ width: '100%' }}>
          <TabContext value={tab}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <TabList
                onChange={handleChange}
                aria-label="lab API tabs example"
              >
                <Tab label="Thông tin nhà cung cấp" value="1" />
                <Tab label="Danh sách sản phẩm" value="2" />
              </TabList>
            </Box>
            <TabPanel value="1">
              <Details control={control} fileValue={fileValue} />
            </TabPanel>
            <TabPanel value="2" sx={{ height: 1 }}>
              <TableData
                supplierId={Number(crudId)}
                active={getValues('active')}
              />
            </TabPanel>
          </TabContext>
        </Box>

        <FormFooter>
          <LinkButton to="/hk_group/product/supplier">Đóng</LinkButton>

          {/* <Button variant="contained" onClick={handleOpenUpdateDialog}>
            Chỉnh sửa thông tin
          </Button> */}
        </FormFooter>
      </FormPaperGrid>
      <FormDialog
        currentID={supplier?.id}
        data={supplier}
        open={openFormDialog}
        handleClose={handleCloseUpdateDialog}
      />
    </PageWrapper>
  );
};

export default DetailsForm;
