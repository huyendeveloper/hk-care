import type { SvgIconComponent } from '@mui/icons-material';
import ClearIcon from '@mui/icons-material/Clear';
import LogoutIcon from '@mui/icons-material/Logout';
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import useMounted from 'hooks/useMounted';
import { useState } from 'react';

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: () => Promise<void>;
  content: {
    label: string;
    description: string;
    icon: SvgIconComponent;
  };
}

const LogoutConfirmDialog = (props: Props) => {
  const { open, content, onClose, onSubmit } = props;
  const { label, description, icon: Icon } = content;
  const mounted = useMounted();

  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await onSubmit();
    } catch (error) {
      console.log(error);
    } finally {
      if (mounted.current) {
        setLoading(false);
        onClose();
      }
    }
  };

  return (
    <Dialog open={open} maxWidth="xs" fullWidth onClose={onClose} scroll="body">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          p: 3,
        }}
      >
        {<Icon sx={{ fontSize: 70, color: 'text.secondary' }} />}
      </Box>
      <Divider />
      <DialogContent>
        <Typography variant="subtitle2" sx={{ textAlign: 'center' }}>
          {description}
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
            cancel
          </Button>
          <LoadingButton
            loading={loading}
            loadingPosition="start"
            startIcon={<LogoutIcon />}
            onClick={handleSubmit}
          >
            {label}
          </LoadingButton>
        </Stack>
      </Box>
    </Dialog>
  );
};

export default LogoutConfirmDialog;
