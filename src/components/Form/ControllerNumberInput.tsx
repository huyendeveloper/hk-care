import { TextField } from '@mui/material';
import type { TextFieldProps } from '@mui/material/TextField';
import React from 'react';
import { Control, Controller, FieldPath, FieldValues } from 'react-hook-form';
import { UseFormSetValue } from 'react-hook-form';
import NumberFormat from 'react-number-format';

interface Props<T> extends Omit<TextFieldProps, 'name'> {
  name: FieldPath<T>;
  setValue: UseFormSetValue<T>;
  value?: number | null | undefined;
  disabled?: boolean;
  inputRef?: any;
  variant?: 'standard' | 'filled' | 'outlined' | undefined;
  type?: string;
  control: Control<T>;
  defaultValue?: number;
  errors?: string;
}

const ControllerNumberInput = <T extends FieldValues>(props: Props<T>) => {
  const {
    name,
    value,
    setValue,
    disabled,
    inputRef,
    defaultValue = 0,
    variant = 'outlined',
    type,
    control,
    inputProps,
    errors,
  } = props;

  if (type === 'percent') {
    return (
      <Controller
        render={({ field: { ref, ...others }, fieldState: { error } }) => {
          console.log('error', error);
          return (
            <NumberFormat
              fullWidth
              value={value}
              customInput={TextField}
              name={name}
              inputRef={ref}
              onValueChange={({ value: v }) =>
                // @ts-ignore
                setValue(name, v ? Number(v) : null)
              }
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
              error={Boolean(error)}
              inputProps={inputProps}
            />
          );
        }}
        name={name}
        control={control}
      />
    );
  }

  return (
    <Controller
      render={({ field: { ref, ...others }, fieldState: { error } }) => {
        return (
          <NumberFormat
            fullWidth
            customInput={TextField}
            value={value}
            defaultValue={defaultValue}
            onValueChange={({ value: v }) =>
              // @ts-ignore
              setValue(name, v ? Number(v) : null)
            }
            allowedDecimalSeparators={[',', '.']}
            decimalScale={0}
            isNumericString
            thousandSeparator=","
            allowNegative={false}
            disabled={disabled}
            error={Boolean(error) || Boolean(errors)}
            helperText={error?.message || errors}
            inputRef={ref}
            variant={variant}
            inputProps={inputProps}
          />
        );
      }}
      name={name}
      control={control}
    />
  );
};

export default ControllerNumberInput;
