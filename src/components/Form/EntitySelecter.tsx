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
  onChangeSelect?: (id: number | null) => Promise<void> | void;
  getOptionDisabled?: (option: number) => boolean;
  placeholder: string;
  forcePopupIcon?: boolean;
  noOptionsText?: string;
  handleChangeInput?: (value: string) => void;
  loading?: boolean;
  disableClearable?: boolean;
  moreInfor?: keyof O[number] & string;
  startAdornment?: any;
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
    moreInfor,
    startAdornment,
    disableClearable = false,
    ...rest
  } = props;

  const labels = options.reduce<Record<number, Label>>((acc, option) => {
    const id = renderValue ? option[renderValue] : option.id;
    const desc = moreInfor ? option[moreInfor] : '';
    const caption = sublabel ? sublabel(option) : null;
    acc[id] = { id, name: renderLabel(option), caption, desc };
    return acc;
  }, {});

  return (
    <Controller
      render={({ field: { value, ...others }, fieldState: { error } }) => (
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
          disableClearable={disableClearable}
          renderInput={(params) => {
            // @ts-ignore
            return (
              <TextField
                error={Boolean(error)}
                helperText={error?.message && error.message}
                placeholder={placeholder}
                {...params}
                InputProps={{
                  ...params.InputProps,
                  // @ts-ignore
                  startAdornment: startAdornment || null,
                }}
                {...rest}
              />
            );
          }}
          renderOption={(props, option: number) => {
            const { name, caption, desc } = labels[option];
            return (
              <Box component="li" {...props} key={option}>
                <Box>
                  {name || ''}
                  {moreInfor && (
                    <>
                      <br />
                      {desc}
                    </>
                  )}
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
          value={value in labels ? value : null}
          onChange={(_event, value: number | null) => {
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

export default EntitySelecter;
