import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { IProductList } from 'interface';
import productListService from 'services/productList.service';
import { FilterParams } from 'types';

interface IInitialState {}

const initialState: IInitialState = {};

export const getAllProduct = createAsyncThunk(
  'productList/getAllProduct',
  async (filters: FilterParams, { rejectWithValue }) => {
    try {
      const { data } = await productListService.getAllProduct(filters);

      if (data.items) {
        const productList = data.items;
        const totalCount = data.totalCount;

        return {
          productList,
          totalCount,
        };
      }

      return rejectWithValue('Get data fail');
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getAllProductList = createAsyncThunk(
  'productList/getAllProductList',
  async (filters: FilterParams, { rejectWithValue }) => {
    try {
      const { data } = await productListService.getAll(filters);

      if (data.items) {
        const productList = data.items;
        const totalCount = data.totalCount;

        return {
          productList,
          totalCount,
        };
      }

      return rejectWithValue('Get data fail');
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const registProductList = createAsyncThunk(
  'productList/regist',
  async (payload: IProductList[], { rejectWithValue }) => {
    const listProductId = payload.map((x) => x.productId) as number[];
    try {
      await productListService.create({ listProductId });
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updatePrice = createAsyncThunk(
  'productList/update',
  async (
    payload: { price: number; productId: number },
    { rejectWithValue }
  ) => {
    try {
      await productListService.update(payload);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const changeStatus = createAsyncThunk(
  'productList/changeStatus',
  async (params: { id: number; status: boolean }, { rejectWithValue }) => {
    const { id, status } = params;
    try {
      await productListService.changeStatus(id, status);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const deleteProductList = createAsyncThunk(
  'productList/delete',
  async (id: number, { rejectWithValue }) => {
    try {
      await productListService.delete(id);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const productListSlice = createSlice({
  name: 'productList',
  initialState,
  reducers: {},
  extraReducers: (builder) => {},
});

export default productListSlice.reducer;
