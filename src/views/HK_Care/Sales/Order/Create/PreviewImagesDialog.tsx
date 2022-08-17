import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import CloseIcon from '@mui/icons-material/Close';
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  IconButton,
  Stack,
} from '@mui/material';
import { connectURL } from 'config';
import { useState } from 'react';

interface Props {
  open: boolean;
  onClose: () => void;
  images: any[];
}

const PreviewImagesDialog = (props: Props) => {
  const { open, onClose, images } = props;
  const [imageIndex, setImageIndex] = useState<number>(0);

  return (
    <Dialog open={open} maxWidth="sm" fullWidth onClose={onClose} scroll="body">
      <Box
        sx={{ display: 'flex', justifyContent: 'space-between', px: 2, py: 2 }}
      >
        <Button sx={{ borderRadius: '30px', cursor: 'default' }}>
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

export default PreviewImagesDialog;
