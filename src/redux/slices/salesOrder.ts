import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import orderSalesService from 'services/orderSales.service';
import salesOrderService from 'services/salesOrder.service';
import { FilterParams } from 'types';

interface OrderSales {
  id: number;
  disCount: number;
  giveMoney: number;
  description: string;
  orderId?: number;
  moneyToPay: number;
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
      moneyToPay: 0,
    },
  ],
};

export const createSalesOrder = createAsyncThunk(
  'salesOrder/create',
  async (payload: OrderSales, { rejectWithValue }) => {
    try {
      const { data } = await orderSalesService.create(payload);
      return { id: data.orderId };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateSalesOrder = createAsyncThunk(
  'salesOrder/update',
  async (payload: OrderSales, { rejectWithValue }) => {
    try {
      await orderSalesService.update(payload);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getAllSaleOrders = createAsyncThunk(
  'salesOrder/getAll',
  async (filters: FilterParams, { rejectWithValue }) => {
    try {
      const { data } = await salesOrderService.getAll(filters);

      if (data.items) {
        const salesOrder = data.items;
        const totalCount = data.totalCount;

        return {
          salesOrder,
          totalCount,
        };
      }

      return rejectWithValue('Get data fail');
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getSaleOrder = createAsyncThunk(
  'salesOrder/get',
  async (id: number, { rejectWithValue }) => {
    try {
      const { data } = await orderSalesService.get(id);
      if (data.statusCode === 200) {
        const saleOrder = data.data;

        return {
          saleOrder,
        };
      }

      return rejectWithValue('Get data fail');
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

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
