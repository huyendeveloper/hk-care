import { yupResolver } from '@hookform/resolvers/yup';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box, Tab } from '@mui/material';
import { LinkButton, LoadingScreen, PageWrapper } from 'components/common';
import { FormFooter, FormHeader, FormPaperGrid } from 'components/Form';
import { connectURL } from 'config';
import { useNotification } from 'hooks';
import { ISupplier } from 'interface';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getSupplier } from 'redux/slices/supplier';
import * as yup from 'yup';
import TableData from '../../ProductList/TableData';
import FormDialog from '../FormDialog';
import Details from './Details';

const validationSchema = yup.object().shape({});

const DetailsForm = () => {
  const dispatch = useDispatch();
  const setNotification = useNotification();
  const { id } = useParams();
  const [supplier, setSupplier] = useState<ISupplier>();
  const [loading, setLoading] = useState<boolean>(true);
  const [openFormDialog, setOpenFormDialog] = useState<boolean>(false);
  const [files, setFiles] = useState<File[] | object[]>([]);
  const [tab, setTab] = useState<string>('1');

  const { control, getValues, reset } = useForm<ISupplier>({
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
    defaultValues: validationSchema.getDefault(),
  });

  const fetchData = async () => {
    if (!id) return;

    // @ts-ignore
    const { payload, error } = await dispatch(getSupplier(Number(id)));

    if (error) {
      setNotification({ error: 'Hệ thống đang gặp sự cố' });
      setLoading(false);
      return;
    }

    setSupplier(payload.supplier);
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

    reset({
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
    });

    if (bussinessLicense) {
      const fileList: object[] = [];
      bussinessLicense.forEach((item: string) => {
        fileList.push({ name: `${connectURL}/${item}` });
      });

      setFiles(fileList);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supplier]);

  if (loading) {
    return <LoadingScreen />;
  }

  const handleCloseUpdateDialog = () => {
    setOpenFormDialog(false);
    fetchData();
  };

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setTab(newValue);
  };

  return (
    <PageWrapper title="Chi tiết nhà cung cấp">
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
              <Details control={control} files={files} />
            </TabPanel>
            <TabPanel value="2">
              <TableData supplierId={Number(id)} active={getValues('active')} />
            </TabPanel>
          </TabContext>
        </Box>

        <FormFooter>
          <LinkButton to="/hk_group/product/supplier">Đóng</LinkButton>
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
