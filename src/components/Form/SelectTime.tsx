import { Box, Button } from '@mui/material';
import { useForm } from 'react-hook-form';
import ControllerDatePicker from './ControllerDatePicker';

export interface ISelectTime {
  startDate?: Date | null;
  lastDate?: Date | null;
}

interface IProps {
  defaultTime: ISelectTime;
  onSelectTime: (body: ISelectTime) => void;
}

const SelectTime = ({ defaultTime, onSelectTime }: IProps) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ISelectTime>({
    mode: 'onChange',
    defaultValues: defaultTime,
  });

  const onSubmit = async (body: ISelectTime) => {
    onSelectTime(body);
  };

  return (
    <Box
      component="form"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: 2,
        mb: 1.5,
        paddingX: 1.5,
        height: '40px',
      }}
      onSubmit={handleSubmit(onSubmit)}
    >
      <ControllerDatePicker
        name="startDate"
        sx={{ width: '150px' }}
        control={control}
        errors={errors}
      />
      <h2 style={{ margin: 0 }}>-</h2>
      <ControllerDatePicker
        name="lastDate"
        sx={{ width: '150px' }}
        control={control}
        errors={errors}
      />
      <Button type="submit" sx={{ height: '40px' }}>
        Chọn
      </Button>
    </Box>
  );
};

export default SelectTime;
