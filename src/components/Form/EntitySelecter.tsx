import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import type { TextFieldProps } from '@mui/material/TextField';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import type { Control, FieldPath, FieldValues } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import { useDebounce } from 'react-use';

export interface Label extends FieldValues {
  name: string;
  caption: string | null;
}

interface Props<T, O extends FieldValues[]>
  extends Omit<TextFieldProps, 'name'> {
  control: Control<T>;
  name: FieldPath<T>;
  options: O;
  renderLabel: (option: O[number]) => string;
  renderValue?: keyof O[number] & string;
  sublabel?: (option: O[number]) => string;
  onChangeSelect?: (id: number | null) => Promise<void> | void;
  getOptionDisabled?: (option: number) => boolean;
  placeholder: string;
  forcePopupIcon?: boolean;
  noOptionsText?: string;
  handleChangeInput?: (value: string) => void;
  loading?: boolean;
}

const EntitySelecter = <T extends FieldValues, O extends FieldValues[]>(
  props: Props<T, O>
) => {
  const {
    control,
    name,
    options,
    renderLabel,
    renderValue,
    sublabel,
    onChangeSelect,
    placeholder,
    disabled,
    forcePopupIcon,
    noOptionsText,
    getOptionDisabled,
    handleChangeInput,
    loading = false,
    ...rest
  } = props;
  const labels = options.reduce((acc: Record<number, Label>, option) => {
    const id = renderValue ? option[renderValue] : option.id;
    const caption = sublabel ? sublabel(option) : null;
    acc[id] = { id, name: renderLabel(option), caption };
    return acc;
  }, {});

  return (
    <Controller
      render={({ field, fieldState: { error } }) => (
        <Autocomplete
          id={name}
          disabled={disabled}
          forcePopupIcon={forcePopupIcon}
          options={options.map((option) => {
            return renderValue ? option[renderValue] : option.id;
          })}
          getOptionLabel={(option) => labels[option]?.name || ''}
          loading={loading}
          noOptionsText={noOptionsText}
          getOptionDisabled={getOptionDisabled}
          multiple={false}
          renderInput={(params) => {
            // @ts-ignore
            // params.inputProps.value = params.inputProps.value | defaultLabel;
            return (
              <TextField
                error={Boolean(error)}
                helperText={error?.message && error.message}
                placeholder={placeholder}
                {...params}
                {...rest}
              />
            );
          }}
          renderOption={(props, option: number) => {
            const { name, caption } = labels[option];
            return (
              <Box component="li" {...props} key={option}>
                <Box>
                  {name || ''}
                  {caption && (
                    <Typography variant="caption" display="block">
                      {caption}
                    </Typography>
                  )}
                </Box>
              </Box>
            );
          }}
          {...field}
          onChange={(_event, value: number | null) => {
            field.onChange(value);
            if (onChangeSelect) {
              onChangeSelect(value);
            }
          }}
        />
      )}
      name={name}
      control={control}
    />
  );
};

export default EntitySelecter;
