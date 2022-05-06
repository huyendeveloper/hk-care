//@ts-nocheck
import ClearIcon from '@mui/icons-material/Clear';
import LogoutIcon from '@mui/icons-material/Logout';
import LoadingButton from '@mui/lab/LoadingButton';
import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import { useCallback, useEffect, useRef, useState } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { getBase64 } from 'utils/Base64';

interface Props {
  image: File | null;
  open: boolean;
  onClose: () => void;
  onCancel?: () => void;
  onSave: (base64: string) => void;
}

const CropImageDialog = ({ image, open, onClose, onSave, onCancel }: Props) => {
  const [upImg, setUpImg] = useState<string>('');
  const imgRef = useRef(null);
  const previewCanvasRef = useRef(null);
  const [crop, setCrop] = useState({ unit: '%', width: 30, aspect: 1 / 1 });
  const [completedCrop, setCompletedCrop] = useState(null);

  const onLoad = useCallback((img) => {
    imgRef.current = img;
  }, []);

  const convertCanvasToFile = (canvas, crop) => {
    if (!crop || !canvas) {
      return;
    }

    return canvas.toDataURL();
  };

  useEffect(() => {
    if (!open) {
      setUpImg('');
      return;
    }

    (async () => {
      const logoBase64 = await getBase64(image);
      setUpImg(logoBase64);
    })();
  }, [image, open]);

  useEffect(() => {
    if (
      !completedCrop ||
      !previewCanvasRef.current ||
      !imgRef.current ||
      !open
    ) {
      return;
    }

    const image = imgRef.current;
    const canvas = previewCanvasRef.current;
    const crop = completedCrop;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const ctx = canvas.getContext('2d');
    const pixelRatio = window.devicePixelRatio;

    canvas.width = crop.width * pixelRatio * scaleX;
    canvas.height = crop.height * pixelRatio * scaleY;

    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingQuality = 'high';

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width * scaleX,
      crop.height * scaleY
    );
  }, [completedCrop, open]);

  const handleSubmit = () => {
    const base64 = convertCanvasToFile(previewCanvasRef.current, completedCrop);
    onSave(base64);
    onClose();
  };

  const handleCancel = () => {
    if (onCancel) onCancel();

    onClose();
  };

  return (
    <Dialog open={open} maxWidth="xs" fullWidth scroll="body">
      <DialogContent>
        <Box
          sx={{
            display: 'flex',
            columnGap: 2,
            mb: 1,
          }}
        >
          <Box>
            <canvas
              ref={previewCanvasRef}
              style={{
                width: '55px',
                height: '55px',
              }}
            />
          </Box>
          <Typography variant="body2">
            Please select which part of the uploaded image you wish to use.
          </Typography>
        </Box>
        <Divider />
        <ReactCrop
          src={upImg}
          onImageLoaded={onLoad}
          crop={crop}
          onChange={(c) => setCrop(c)}
          onComplete={(c) => setCompletedCrop(c)}
        />
      </DialogContent>
      <Divider />
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', px: 2, py: 2 }}>
        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            startIcon={<ClearIcon />}
            onClick={handleCancel}
          >
            cancel
          </Button>
          <LoadingButton
            loading={false}
            loadingPosition="start"
            startIcon={<LogoutIcon />}
            color="info"
            onClick={handleSubmit}
          >
            Confirm
          </LoadingButton>
        </Stack>
      </Box>
    </Dialog>
  );
};

export default CropImageDialog;
