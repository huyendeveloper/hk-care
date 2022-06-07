export const numberFormat = (value: number): string => {
  const formatedValue = value.toLocaleString('en-EN', {
    style: 'currency',
    currency: 'VND',
  });

  return formatedValue.substr(1) + formatedValue.substr(0, 1);
};
