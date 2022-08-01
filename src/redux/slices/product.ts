import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { IProduct } from 'interface';
import productService from 'services/product.service';
import { FilterParams } from 'types';

interface IInitialState {}

const initialState: IInitialState = {};

export const getAllProduct = createAsyncThunk(
  'product/getAll',
  async (filters: FilterParams, { rejectWithValue }) => {
    try {
      const { data } = await productService.getAll(filters);

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

export const createProduct = createAsyncThunk(
  'product/create',
  async (payload: IProduct, { rejectWithValue }) => {
    const { image, ...data } = payload;
    try {
      await productService.create(data, image);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateProduct = createAsyncThunk(
  'product/update',
  async (payload: IProduct, { rejectWithValue }) => {
    const { image, ...data } = payload;
    try {
      await productService.update(data, image);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const changeStatus = createAsyncThunk(
  'product/changeStatus',
  async (params: { id: number; status: boolean }, { rejectWithValue }) => {
    const { id, status } = params;
    try {
      await productService.changeStatus(id, status);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const deleteProduct = createAsyncThunk(
  'product/delete',
  async (id: number, { rejectWithValue }) => {
    try {
      await productService.delete(id);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {},
  extraReducers: (builder) => {},
});

export default productSlice.reducer;
