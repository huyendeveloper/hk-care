import { TextField } from '@mui/material';
import type { TextFieldProps } from '@mui/material/TextField';
import React from 'react';
import type { FieldPath, FieldValues } from 'react-hook-form';
import { UseFormSetValue } from 'react-hook-form';
import NumberFormat from 'react-number-format';

interface Props<T> extends Omit<TextFieldProps, 'name'> {
  name: FieldPath<T>;
  setValue: UseFormSetValue<T>;
  value?: number | null | undefined;
  disabled?: boolean;
  defaultValue?: number;
  inputRef?: any;
  variant?: 'standard' | 'filled' | 'outlined' | undefined;
  type?: string;
  error?: boolean;
}

const ControllerNumberInput = <T extends FieldValues>(props: Props<T>) => {
  const {
    name,
    value,
    setValue,
    disabled,
    defaultValue,
    inputRef,
    variant = 'outlined',
    type,
    error = false,
  } = props;

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
        defaultValue={defaultValue}
        error={error}
      />
    );
  }

  if (type === 'percent') {
    return (
      <NumberFormat
        fullWidth
        customInput={TextField}
        defaultValue={defaultValue}
        name={name}
        inputRef={inputRef}
        value={defaultValue}
        // @ts-ignore
        onValueChange={({ value: v }) => setValue(name, v ? Number(v) : null)}
        allowedDecimalSeparators={[',', '.']}
        decimalScale={0}
        isNumericString
        thousandSeparator=","
        allowNegative={false}
        variant={variant}
        disabled={disabled}
        isAllowed={(values) => {
          const { floatValue } = values;
          // @ts-ignore
          return !floatValue || (floatValue <= 100 && floatValue >= 0);
        }}
        error={error}
      />
    );
  }
  return (
    <NumberFormat
      fullWidth
      customInput={TextField}
      defaultValue={defaultValue}
      value={defaultValue}
      name={name}
      inputRef={inputRef}
      // @ts-ignore
      onValueChange={({ value: v }) => setValue(name, v ? Number(v) : null)}
      allowedDecimalSeparators={[',', '.']}
      decimalScale={0}
      isNumericString
      thousandSeparator=","
      allowNegative={false}
      variant={variant}
      disabled={disabled}
      error={error}
    />
  );
};

export default ControllerNumberInput;
