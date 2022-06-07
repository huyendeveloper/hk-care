import { TextField } from '@mui/material';
import type { TextFieldProps } from '@mui/material/TextField';
import { getValue } from '@testing-library/user-event/dist/utils';
import React from 'react';
import type { FieldPath, FieldValues } from 'react-hook-form';
import { UseFormSetValue } from 'react-hook-form';
import NumberFormat from 'react-number-format';

interface IProps {
  value?: number;
  setValue: (value: number) => void;
}

interface Props<T> extends Omit<TextFieldProps, 'name'> {
  name: FieldPath<T>;
  setValue: UseFormSetValue<T>;
  value?: number | null | undefined;
  disabled?: boolean;
  defaultValue?: number;
}

const ControllerNumberInput = <T extends FieldValues>(props: Props<T>) => {
  const { name, value, setValue, disabled, defaultValue } = props;

  if (value) {
    return (
      <NumberFormat
        fullWidth
        customInput={TextField}
        value={value}
        // @ts-ignore
        onValueChange={({ value: v }) => setValue(name, v)}
        allowedDecimalSeparators={[',', '.']}
        decimalScale={0}
        isNumericString
        thousandSeparator=","
        allowNegative={false}
        disabled={disabled}
      />
    );
  }
  return (
    <NumberFormat
      fullWidth
      customInput={TextField}
      defaultValue={defaultValue}
      name={name}
      // @ts-ignore
      onValueChange={({ value: v }) => setValue(name, v ? Number(v) : null)}
      allowedDecimalSeparators={[',', '.']}
      decimalScale={0}
      isNumericString
      thousandSeparator=","
      allowNegative={false}
    />
  );
};

export default ControllerNumberInput;
