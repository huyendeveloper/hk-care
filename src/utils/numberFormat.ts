export const numberFormat = (value: number): string => {
  const formatedValue = (Math.abs(value) || 0).toLocaleString('en-EN');

  return (value < 0 ? '- ' : '') + formatedValue;
};
