import type { SvgIconComponent } from '@mui/icons-material';
import ClearIcon from '@mui/icons-material/Clear';
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useState } from 'react';

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: () => Promise<void>;
  onRefresh: () => void;
  content: {
    title: string;
    label: string;
    description: string;
    subdescription: string;
    headerIcon: SvgIconComponent;
    submitIcon: SvgIconComponent;
  };
}

const DeleteConfirmDialog = (props: Props) => {
  const { open, content, onClose, onSubmit, onRefresh } = props;
  const [loading, setLoading] = useState<boolean>(false);

  const {
    label,
    title,
    description,
    subdescription,
    headerIcon: HeaderIcon,
    submitIcon: SubmitIcon,
  } = content;

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await onSubmit();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      onRefresh();
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} scroll="body">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          p: 3,
        }}
      >
        {<HeaderIcon sx={{ fontSize: 70, color: 'text.secondary' }} />}
        <Typography sx={{ mt: 1 }} variant="h6" color="text.secondary">
          {title}
        </Typography>
      </Box>
      <Divider />
      <DialogContent>
        <Typography
          variant="subtitle1"
          gutterBottom
          sx={{ textAlign: 'center' }}
        >
          {description}
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: 'bold', textAlign: 'center' }}
        >
          {subdescription}
        </Typography>
      </DialogContent>
      <Divider />
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', px: 2, py: 2 }}>
        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            startIcon={<ClearIcon />}
            onClick={onClose}
          >
            Cancel
          </Button>
          <LoadingButton
            loading={loading}
            loadingPosition="start"
            startIcon={<SubmitIcon />}
            color="error"
            onClick={handleSubmit}
          >
            {label}
          </LoadingButton>
        </Stack>
      </Box>
    </Dialog>
  );
};

export default DeleteConfirmDialog;
