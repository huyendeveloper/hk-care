import CancelIcon from '@mui/icons-material/Cancel';
import DeleteIcon from '@mui/icons-material/Delete';
import ReplyIcon from '@mui/icons-material/Reply';
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import useNotification from 'hooks/useNotification';
import { useState } from 'react';
import { deleteExampleCRUD } from 'services/crud';

interface Props {
  open: boolean;
  onClose: () => void;
  id: number | null;
  onForceUpdate: () => void;
}



const DeleteDialog = (props: Props) => {
  const { open, onClose, id, onForceUpdate } = props;
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
        <DeleteIcon sx={{ fontSize: 70, color: 'text.secondary' }} />
        <Typography sx={{ mt: 1 }} variant="h6" color="text.secondary">
          Delete CRUD Example
        </Typography>
      </Box>
      <Divider />
      <DialogContent>
        <Typography
          variant="subtitle1"
          gutterBottom
          sx={{ textAlign: 'center' }}
        >
          To <strong>delete</strong> CRUD Example, confirm the deletion by
          clicking on <strong>Delete</strong>.
        </Typography>
      </DialogContent>
      <Divider />
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', px: 2, py: 2 }}>
        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            startIcon={<CancelIcon />}
            onClick={onClose}
          >
            Cancel
          </Button>
          <LoadingButton
            loading={loading}
            loadingPosition="start"
            startIcon={<ReplyIcon />}
            color="error"
            onClick={handleUpdate}
          >
            Delete
          </LoadingButton>
        </Stack>
      </Box>
    </Dialog>
  );
};

export default DeleteDialog;
