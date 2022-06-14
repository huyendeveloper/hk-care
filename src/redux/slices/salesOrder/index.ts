import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IInitialState {
  loading: boolean;
  productSales: object | null;
}

const initialState: IInitialState = {
  loading: false,
  productSales: null,
};

const salesOrderSlice = createSlice({
  name: 'salesOrder',
  initialState,
  reducers: {
    addProductSales: (state, action: PayloadAction<object | null>) => {
      state.productSales = action.payload;
    },
  },
  extraReducers: (builder) => {},
});

export const { addProductSales } = salesOrderSlice.actions;
export default salesOrderSlice.reducer;
