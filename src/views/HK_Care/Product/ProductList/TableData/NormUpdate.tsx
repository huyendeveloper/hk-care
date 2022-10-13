import { yupResolver } from '@hookform/resolvers/yup';
import DoneOutlineIcon from '@mui/icons-material/DoneOutline';
import EditIcon from '@mui/icons-material/Edit';
import { IconButton, Paper, Stack } from '@mui/material';
import ControllerNumberInput from 'components/Form/ControllerNumberInput';
import { useNotification } from 'hooks';
import { INorm } from 'interface';
import React, { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { updateNorm } from 'redux/slices/productList';
import * as yup from 'yup';

const validationSchema = yup.object().shape({});

interface IProps {
  norm: number;
  productId: number;
  showBackdrop: boolean;
  setShowBackdrop: (showBackdrop: boolean) => void;
}

const NormUpdate = ({
  norm,
  productId,
  showBackdrop,
  setShowBackdrop,
}: IProps) => {
  const dispatch = useDispatch();
  const setNotification = useNotification();
  const [editing, setEditing] = useState<boolean>(false);

  const { control, setValue, getValues, handleSubmit } = useForm<INorm>({
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
    defaultValues: { norm },
  });

  const onSubmit = async (body: INorm) => {
    if (!body.norm) {
      setNotification({ error: 'Chưa nhập định mức!' });
      return;
    }
    setShowBackdrop(true);
    const { error, payload } = await dispatch(
      // @ts-ignore
      updateNorm({ productId, norm: body.norm })
    );
    if (error) {
      setNotification({ error: 'Hệ thống đang gặp sự cố' });
      setShowBackdrop(false);
      return;
    }
    setNotification({
      message: payload.message,
      severity: 'success',
    });
    setShowBackdrop(false);
    setEditing(false);
  };

  const handleOpenEditing = useCallback(() => {
    setEditing(true);
  }, []);

  return (
    <Stack flexDirection="row">
      <Paper
        component="form"
        sx={{ boxShadow: 'none', display: 'flex', background: 'none' }}
        onSubmit={handleSubmit(onSubmit)}
      >
        <ControllerNumberInput
          name="norm"
          setValue={setValue}
          defaultValue={getValues(`norm`)}
          inputProps={{
            style: {
              width: '84px',
              height: '44px',
              border: editing ? '2px solid #00AB55' : 'none',
              borderRadius: 'inherit',
              boxSizing: 'border-box',
            },
          }}
          control={control}
          disabled={!editing}
        />
        {editing && (
          <IconButton type="submit">
            <DoneOutlineIcon sx={{ color: '#137b3e' }} />
          </IconButton>
        )}
      </Paper>
      {!editing && (
        <IconButton type="button" onClick={handleOpenEditing}>
          <EditIcon />
        </IconButton>
      )}
    </Stack>
  );
};

export default React.memo(NormUpdate);
