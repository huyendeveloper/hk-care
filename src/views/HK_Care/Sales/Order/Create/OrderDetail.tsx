import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import {
  Backdrop,
  Box,
  CircularProgress,
  IconButton,
  InputAdornment,
  Stack,
} from '@mui/material';
import { LinkIconButton } from 'components/common';
import { ControllerTextarea, EntitySelecter } from 'components/Form';
import ControllerMultiImages from 'components/Form/ControllerMultiImages';
import ControllerNumberInput from 'components/Form/ControllerNumberInput';
import { useEffect, useMemo, useState } from 'react';
import { useWatch } from 'react-hook-form';
import importReceiptService from 'services/importReceipt.service';
import { numberFormat } from 'utils/numberFormat';
import MapDialog from './PreviewImagesDialog';

interface IProps {
  control: any;
  setValue: any;
  getValues: any;
}

const OrderDetail = ({ control, setValue, getValues }: IProps) => {
  const [files, setFiles] = useState<File[] | object[]>(
    getValues('images') || []
  );
  const [showBackdrop, setShowBackdrop] = useState<boolean>(false);
  const [previewImages, setPreviewImages] = useState<boolean>(false);

  const orderDetailDtos = useWatch({
    control,
    name: 'orderDetailDtos',
  });

  const bill = useMemo(
    () =>
      orderDetailDtos
        ? orderDetailDtos.reduce(
            // @ts-ignore
            (prev, cur) => prev + (Number(cur?.billPerProduct) || 0),
            0
          )
        : 0,
    [orderDetailDtos]
  );
  const discountValue = useWatch({ control, name: 'disCount' }) || 0;
  const paid = useWatch({ control, name: 'giveMoney' }) || 0;
  const moneyToPay = useWatch({ control, name: 'moneyToPay' }) || 0;
  const orderType = useWatch({ control, name: 'orderType' });

  const selectOrderTypeOptions = useMemo(
    () => [
      { id: 1, name: 'Khách bán lẻ' },
      { id: 2, name: 'Bán theo kê đơn bác sĩ' },
    ],
    []
  );

  const mockCustomers = useMemo(
    () => [
      { id: 1, name: 'Nguyễn Thu Hà', phone: '0987654321' },
      { id: 2, name: 'Tô Thanh Minh', phone: '0987654321' },
    ],
    []
  );

  useEffect(() => {
    setValue('moneyToPay', bill - (discountValue / 100) * bill || 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setValue('moneyToPay', bill - (discountValue / 100) * bill || 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bill, discountValue]);

  const handleView = async () => {
    if (files.length === 0) {
      return;
    }
    setPreviewImages(true);
  };

  // @ts-ignore
  const handleChangeFiles = async (newValue) => {
    setShowBackdrop(true);
    setFiles(newValue);
    // @ts-ignore
    await newValue.forEach(async (file, index, array) => {
      // @ts-ignore
      if (file?.type) {
        const { data } = await importReceiptService.getPathFileReceipt(file);
        // @ts-ignore
        setFiles((prev) => {
          const newFile = [...prev];
          // @ts-ignore
          newFile[index] = { name: file?.name, url: data };
          return newFile;
        });
      }
    });
  };

  useEffect(() => {
    if (!showBackdrop) return;
    // @ts-ignore
    const fileList = files.filter((item) => Boolean(item.type));
    if (fileList.length === 0) {
      setShowBackdrop(false);
      setValue('images', files);
    }
  }, [files, showBackdrop]);

  return (
    <Stack p={2} gap={2}>
      <Stack
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Box sx={{ width: '87%' }}>
          <EntitySelecter
            name="customer"
            control={control}
            options={mockCustomers}
            renderLabel={(field) => field.name}
            renderValue="id"
            moreInfor="phone"
            placeholder="Thêm khách hàng vào hóa đơn"
            disableClearable
            variant="standard"
            startAdornment={
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            }
          />
        </Box>
        <LinkIconButton target="_blank" to="/add-customer">
          <IconButton>
            <AddIcon />
          </IconButton>
        </LinkIconButton>
      </Stack>
      <Stack
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <div>Loại hóa đơn</div>
        <Box sx={{ width: '60%' }}>
          <EntitySelecter
            name="orderType"
            control={control}
            options={selectOrderTypeOptions}
            renderLabel={(field) => field.name}
            renderValue="id"
            placeholder=""
            disableClearable
            variant="standard"
          />
        </Box>
      </Stack>
      {orderType === 2 && (
        <ControllerMultiImages
          files={files}
          setFiles={(newValue) => {
            handleChangeFiles(newValue);
          }}
          message="Tài liệu đính kèm chỉ cho phép file ảnh."
          handleView={handleView}
        />
      )}
      <Stack flexDirection="row" justifyContent="space-between">
        <div>
          Tổng tiền: (<b>{orderDetailDtos?.length || 0}</b> sản phẩm)
        </div>
        <div>{numberFormat(bill)}</div>
      </Stack>
      <Stack flexDirection="row" justifyContent="space-between">
        <div>Chiết khấu (%)</div>
        <div style={{ width: '40%' }}>
          <ControllerNumberInput
            name="disCount"
            variant="standard"
            setValue={setValue}
            type="percent"
            value={getValues(`disCount`)}
            control={control}
            inputProps={{ style: { textAlign: 'right' } }}
          />
        </div>
      </Stack>
      <Stack flexDirection="row" justifyContent="space-between">
        <b>KHÁCH PHẢI TRẢ</b>
        <div>{numberFormat(moneyToPay)}</div>
      </Stack>
      <hr style={{ width: '100%' }} />
      <Stack flexDirection="row" justifyContent="space-between">
        <b>Tiền khách đưa</b>
        <div style={{ width: '40%' }}>
          <ControllerNumberInput
            name="giveMoney"
            variant="standard"
            setValue={setValue}
            control={control}
            value={getValues('giveMoney')}
            inputProps={{ style: { textAlign: 'right' } }}
          />
        </div>
      </Stack>
      <Stack flexDirection="row" justifyContent="space-between">
        <div>Tiền mặt</div>
      </Stack>
      <hr style={{ width: '100%' }} />
      <Stack flexDirection="row" justifyContent="space-between">
        <b>Tiền thừa trả khách</b>
        <div>
          {numberFormat(
            paid - (bill - ((getValues(`disCount`) || 0) / 100) * bill)
          )}
        </div>
      </Stack>
      <b>Ghi chú</b>
      <ControllerTextarea
        maxRows={5}
        minRows={5}
        name="description"
        control={control}
      />

      <MapDialog
        open={previewImages}
        onClose={() => setPreviewImages(false)}
        images={files || []}
      />
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={showBackdrop}
        onClick={() => setShowBackdrop(false)}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Stack>
  );
};

export default OrderDetail;
