import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface OrderSales {
  id: number;
  disCount: number;
  giveMoney: number;
  description: string;
  createOrderDetailDtos: {
    productId: number;
    productName: string;
    quantity: number;
    price: number;
    measureId: number;
    measureName: string;
    discount: number;
    mor: string;
    noon: string;
    night: string;
    description: string;
    billPerProduct: number;
  }[];
}

interface IInitialState {
  loading: boolean;
  productSales: object | null;
  orderSales: OrderSales[];
}

const initialState: IInitialState = {
  loading: false,
  productSales: null,

  orderSales: [
    {
      id: 1,
      disCount: 0,
      giveMoney: 0,
      description: '',
      createOrderDetailDtos: [],
    },
  ],
};

const salesOrderSlice = createSlice({
  name: 'salesOrder',
  initialState,
  reducers: {
    addProductSales: (state, action: PayloadAction<object | null>) => {
      state.productSales = action.payload;
    },
    updateOrderSales: (state, action: PayloadAction<any>) => {
      const newOrderSales = [
        ...state.orderSales.filter(
          // @ts-ignore
          (x) => x.id !== action.payload.id
        ),
        action.payload,
      ];
      state.orderSales = newOrderSales;
    },
  },
  extraReducers: (builder) => {},
});

export const { addProductSales, updateOrderSales } = salesOrderSlice.actions;
export default salesOrderSlice.reducer;
