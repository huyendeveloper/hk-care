import DeleteIcon from '@mui/icons-material/Delete';
import LoadingButton from '@mui/lab/LoadingButton';
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import { useNotification } from 'hooks';
import { useState } from 'react';
import { deleteExampleCRUD } from 'services/crud';

interface Props {
  open: boolean;
  onClose: () => void;
  id: number | null;
  onForceUpdate: () => void;
  name?: string;
}

const DeleteDialog = (props: Props) => {
  const { open, onClose, id, onForceUpdate, name = '' } = props;
  const setNotification = useNotification();

  const [loading, setLoading] = useState<boolean>(false);

  const handleUpdate = async () => {
    setLoading(true);
    if (id) {
      try {
        const res = await deleteExampleCRUD(id);
        if (res.success) {
          setNotification({
            message: 'Delete success.',
            severity: 'success',
          });
        } else {
          setNotification({
            error: 'Delete failure.',
          });
        }
      } catch (error) {
        setNotification({
          error: 'Something went wrong.',
        });
      } finally {
        onClose();
        setLoading(false);
        onForceUpdate();
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
        <DeleteIcon sx={{ fontSize: 70, color: 'text.secondary' }} />
      </Box>
      <Divider />
      <DialogContent>
        <Typography
          variant="subtitle1"
          gutterBottom
          sx={{ textAlign: 'center' }}
        >
          Bạn có muốn xóa "{name}"?
        </Typography>
      </DialogContent>
      <Divider />
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', px: 2, py: 2 }}>
        <Stack direction="row" spacing={1}>
          <Button variant="outlined" onClick={onClose}>
            Hủy
          </Button>

          <LoadingButton loading={loading} color="error" onClick={handleUpdate}>
            Xóa
          </LoadingButton>
        </Stack>
      </Box>
    </Dialog>
  );
};

export default DeleteDialog;
