import { TextareaAutosize, TextareaAutosizeProps } from '@mui/material';
import type { Control, FieldPath, FieldValues } from 'react-hook-form';
import { Controller } from 'react-hook-form';

interface Props<T> extends Omit<TextareaAutosizeProps, 'name'> {
  control: Control<T>;
  name: FieldPath<T>;
}

const ControllerTextarea = <T extends FieldValues>(props: Props<T>) => {
  const { control, name, ...rest } = props;

  return (
    <Controller
      render={({ field, fieldState: { error } }) => (
        <TextareaAutosize
          id={name}
          style={{ width: '100%' }}
          {...field}
          {...rest}
        />
      )}
      name={name}
      control={control}
    />
  );
};

export default ControllerTextarea;
