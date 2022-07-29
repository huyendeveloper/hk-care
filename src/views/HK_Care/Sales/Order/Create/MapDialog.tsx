import {
  Box,
  Button,
  Dialog,
  DialogContent,
  Divider,
  Grid,
  IconButton,
  Stack,
  Tooltip,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { LoadingButton } from '@mui/lab';
import { useState } from 'react';
import { connectURL } from 'config';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';

interface Props {
  open: boolean;
  onClose: () => void;
  images: any[];
}

const LeftCabinet = ({
  cabinetNumber,
  buttonLabel,
  tooltip,
}: {
  cabinetNumber: number;
  buttonLabel?: string;
  tooltip?: string;
}) => {
  return (
    <Stack flexDirection="row" gap={1} mb={1}>
      <Tooltip title={tooltip || ''} placement="right">
        <Button variant="outlined">Tủ {cabinetNumber}</Button>
      </Tooltip>
      <Button sx={buttonLabel ? { backgroundColor: '#da6a04' } : {}}>
        {buttonLabel}
      </Button>
    </Stack>
  );
};

const RightCabinet = ({
  cabinetNumber,
  tooltip,
}: {
  cabinetNumber: number;
  tooltip?: string;
}) => {
  return (
    <Stack flexDirection="row" gap={1} mb={1}>
      <Button></Button>
      <Tooltip title={tooltip || ''} placement="right">
        <Button variant="outlined">Tủ {cabinetNumber}</Button>
      </Tooltip>
    </Stack>
  );
};

const BottomCabinet = ({ cabinetNumber }: { cabinetNumber: number }) => {
  return (
    <Stack gap={1} mr={1}>
      <Button sx={{ color: '#00AB55' }}>.</Button>
      <Button variant="outlined">Tủ {cabinetNumber}</Button>
    </Stack>
  );
};

const MapDialog = (props: Props) => {
  const { open, onClose, images } = props;
  const [imageIndex, setImageIndex] = useState<number>(0);

  return (
    <Dialog open={open} maxWidth="sm" fullWidth onClose={onClose} scroll="body">
      <Box
        sx={{ display: 'flex', justifyContent: 'space-between', px: 2, py: 2 }}
      >
        <Button sx={{ borderRadius: '30px' }}>
          Hình {imageIndex + 1}/{images.length}
        </Button>
        <LoadingButton
          startIcon={<CloseIcon />}
          variant="outlined"
          onClick={onClose}
          sx={{ borderRadius: '30px' }}
        >
          Đóng
        </LoadingButton>
      </Box>
      <DialogContent
        sx={{
          pt: '40px',
          pb: '40px',
          minHeight: '70vh',
          display: 'flex',
        }}
      >
        <Stack
          alignItems="center"
          flexDirection="row"
          justifyContent="space-between"
          sx={{ width: '100%' }}
        >
          <IconButton
            sx={{ p: 0 }}
            onClick={() =>
              setImageIndex(
                imageIndex === 0 ? images.length - 1 : imageIndex - 1
              )
            }
          >
            <ArrowCircleLeftIcon fontSize="large" />
          </IconButton>
          <img
            src={`${connectURL}/${images[imageIndex]?.url || ''}`}
            style={{ width: '400px' }}
            alt=""
          />
          <IconButton
            sx={{ p: 0 }}
            onClick={() =>
              setImageIndex(
                imageIndex === images.length - 1 ? 0 : imageIndex + 1
              )
            }
          >
            <ArrowCircleRightIcon fontSize="large" />
          </IconButton>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default MapDialog;
