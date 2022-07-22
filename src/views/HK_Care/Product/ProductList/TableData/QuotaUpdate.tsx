import { yupResolver } from '@hookform/resolvers/yup';
import CheckIcon from '@mui/icons-material/Check';
import EditIcon from '@mui/icons-material/Edit';
import { IconButton, Paper, Stack } from '@mui/material';
import ControllerNumberInput from 'components/Form/ControllerNumberInput';
import { IQuota } from 'interface';
import React, { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

const validationSchema = yup.object().shape({});

interface IProps {
  quota: number;
}

const QuotaUpdate = ({ quota }: IProps) => {
  const [editing, setEditing] = useState<boolean>(false);

  const { control, setValue, getValues, handleSubmit } = useForm<IQuota>({
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
    defaultValues: { quota },
  });

  const onSubmit = async (payload: IQuota) => {
    console.log('payload', payload);
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
          name="quota"
          setValue={setValue}
          defaultValue={getValues(`quota`)}
          inputProps={{ style: { width: '52px' } }}
          control={control}
        />
        {editing && (
          <IconButton type="submit">
            <CheckIcon />
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

export default React.memo(QuotaUpdate);
