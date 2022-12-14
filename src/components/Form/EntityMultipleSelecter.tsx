import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import type { TextFieldProps } from '@mui/material/TextField';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import type { Control, FieldPath, FieldValues } from 'react-hook-form';
import { Controller } from 'react-hook-form';

export interface Label extends FieldValues {
  name: string;
  caption: string | null;
}

interface Props<T extends FieldValues, O extends FieldValues[]>
  extends Omit<TextFieldProps, 'name'> {
  control: Control<T>;
  name: FieldPath<T>;
  options: O;
  renderLabel: (option: O[number]) => string;
  renderValue?: keyof O[number] & string;
  sublabel?: (option: O[number]) => string;
  onChangeSelect?: (ids: number[] | null) => Promise<void> | void;
  getOptionDisabled?: (option: number) => boolean;
  placeholder: string;
  forcePopupIcon?: boolean;
  noOptionsText?: string;
}

const EntityMultipleSelecter = <T extends FieldValues, O extends FieldValues[]>(
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
      render={({ field: { value, ...others }, fieldState: { error } }) => (
        <Autocomplete
          id={name}
          fullWidth
          disabled={disabled}
          ChipProps={{
            sx: { borderRadius: 1 },
            ...(disabled && {
              onDelete: undefined,
            }),
          }}
          forcePopupIcon={forcePopupIcon}
          options={options.map((option) => {
            return renderValue ? option[renderValue] : option.id;
          })}
          getOptionLabel={(option) => labels[option]?.name || 'Not available'}
          noOptionsText={noOptionsText}
          getOptionDisabled={getOptionDisabled}
          multiple={true}
          renderInput={(params) => (
            <TextField
              error={Boolean(error)}
              helperText={error?.message && error.message}
              placeholder={
                Array.isArray(value) && value.length ? undefined : placeholder
              }
              {...params}
              {...rest}
            />
          )}
          renderOption={(props, option: number) => {
            const { name, caption } = labels[option];
            return (
              <Box component="li" {...props} key={option}>
                <Box>
                  {name || 'Not available'}
                  {caption && (
                    <Typography variant="caption" display="block">
                      {caption}
                    </Typography>
                  )}
                </Box>
              </Box>
            );
          }}
          {...others}
          value={
            Array.isArray(value) && value.every((id: number) => id in labels)
              ? value
              : []
          }
          onChange={(_event, value: number[] | null) => {
            others.onChange(value);
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

export default EntityMultipleSelecter;
