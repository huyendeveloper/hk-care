import type { SvgIconComponent } from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import LoadingButton from '@mui/lab/LoadingButton';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import DialogFooter from 'components/Dialog/DialogFooter';
import DialogHeader from 'components/Dialog/DialogHeader';
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
    subdescription?: string;
    headerIcon: SvgIconComponent;
    submitIcon: SvgIconComponent;
  };
  type?: 'confirm' | 'delete';
}

const ConfirmDialog = (props: Props) => {
  const { open, content, onClose, onSubmit, onRefresh, type } = props;
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
      <DialogHeader title={title} icon={HeaderIcon} />
      <DialogContent>
        <Typography
          variant="subtitle1"
          gutterBottom
          sx={{ textAlign: 'center' }}
        >
          {description}
        </Typography>
        {subdescription && (
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 'bold', textAlign: 'center' }}
          >
            {subdescription}
          </Typography>
        )}
      </DialogContent>
      <DialogFooter sx={{ mt: 0 }}>
        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            startIcon={<CloseIcon />}
            onClick={onClose}
          >
            Cancel
          </Button>
          <LoadingButton
            loading={loading}
            loadingPosition="start"
            startIcon={<SubmitIcon />}
            color={type === 'delete' ? 'error' : 'primary'}
            onClick={handleSubmit}
          >
            {label}
          </LoadingButton>
        </Stack>
      </DialogFooter>
    </Dialog>
  );
};

export default ConfirmDialog;
