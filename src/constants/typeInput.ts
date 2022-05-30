import * as yup from 'yup';

export const yupOnlyNumber = (require?: string) => {
  if (require) {
    return yup
      .number()
      .required(require)
      .typeError('Vui lòng chỉ nhập số.')
      .integer('Vui lòng chỉ nhập số.')
      .min(0, 'Vui lòng chỉ nhập số.');
  }
  return yup
    .number()
    .typeError('Vui lòng chỉ nhập số.')
    .integer('Vui lòng chỉ nhập số.')
    .min(0, 'Vui lòng chỉ nhập số.');
};

export const yupDate = yup
  .date()
  .typeError('Vui lòng nhập đúng định dạng dd/mm/yyyy.');

export const typeNumber = (setValue: (value: string) => void) => {
  return {
    pattern: '[0-9]*',
    onKeyUp: (
      e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
      // @ts-ignore
      if (!e.target.validity.valid) {
        // @ts-ignore
        setValue(e.target.value.slice(0, -1));
      }
    },
  };
};
