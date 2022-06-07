export const numberFormat = (value: number): string => {
  const formatedValue = (Math.abs(value) || 0).toLocaleString('en-EN', {
    style: 'currency',
    currency: 'VND',
  });

  return (
    (value < 0 ? '- ' : '') +
    formatedValue.substr(1) +
    formatedValue.substr(0, 1)
  );
};
