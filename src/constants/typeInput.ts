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
