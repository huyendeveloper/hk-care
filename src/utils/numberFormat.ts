export const numberFormat = (value: number): string => {
  const formatedValue = (Math.abs(Math.floor(value)) || 0).toLocaleString(
    'en-EN'
  );

  return (value < 0 ? '- ' : '') + formatedValue;
};
