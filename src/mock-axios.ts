export const randomIntFromInterval = () => {
  const max = 2000;
  const min = 1;
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export const mockCRUDList = {
  data: [
    {
      id: randomIntFromInterval(),
      textField: `John`,
      selectField: 1,
      mutipleSelectField: [42, 12],
      radioField: 1,
      switchField: true,
      date: new Date(
        'Wed Mar 16 2022 16:20:00 GMT+0700 (Indochina Time)'
      ).toISOString(),
      time: new Date(
        'Wed Mar 16 2022 05:20:00 GMT+0700 (Indochina Time)'
      ).toISOString(),
      image: '',
    },

    {
      id: randomIntFromInterval(),
      textField: `Bentley`,
      selectField: 2,
      mutipleSelectField: [72],
      radioField: 1,
      switchField: false,
      date: null,
      time: null,
      image: '',
    },

    {
      id: randomIntFromInterval(),
      textField: `Hello`,
      selectField: 1,
      mutipleSelectField: [44],
      radioField: 1,
      switchField: true,
      date: null,
      time: null,
      image: '',
    },
  ],
  total: 3,
};

export const mockSelectFieldOptions = [
  {
    id: 1,
    name: 'Field 1',
  },
  {
    id: 2,
    name: 'Field 2',
  },
];

export const mockRoleOptions = [
  {
    id: 1,
    name: 'Admin',
  },
  {
    id: 2,
    name: 'User',
  },
];

export const mockMutipleSelectOptions = [
  {
    id: 12,
    name: 'Mutiple 12',
  },
  {
    id: 14,
    name: 'Mutiple 14',
  },
  {
    id: 44,
    name: 'Mutiple 44',
  },
  {
    id: 42,
    name: 'Mutiple 42',
  },
  {
    id: 72,
    name: 'Mutiple 72',
  },
];

export const mockRadioOptions = [
  { value: 1, label: 'Reason 1' },
  { value: 2, label: 'Reason 2' },
];
