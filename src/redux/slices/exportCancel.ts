import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { IExportCancel } from 'interface';
import exportCancelService from 'services/exportCancel.service';
import { FilterParams } from 'types';

interface IInitialState {}

const initialState: IInitialState = {};

export const getAllProduct = createAsyncThunk(
  'exportCancel/getAllProduct',
  async (filters: FilterParams, { rejectWithValue }) => {
    try {
      const { data } = await exportCancelService.getProductList(filters);

      if (data) {
        const productList = data;

        return {
          productList,
        };
      }

      return rejectWithValue('Get data fail');
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const createExportWH = createAsyncThunk(
  'exportCancel/create',
  async (payload: IExportCancel, { rejectWithValue }) => {
    try {
      await exportCancelService.create(payload);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateExportCancel = createAsyncThunk(
  'exportCancel/update',
  async (payload: IExportCancel, { rejectWithValue }) => {
    try {
      await exportCancelService.update(payload);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getAllExportCancel = createAsyncThunk(
  'exportCancel/getAll',
  async (filters: FilterParams, { rejectWithValue }) => {
    try {
      const { data } = await exportCancelService.getAll(filters);

      if (data.items) {
        const exportWHList = data.items;
        const totalCount = data.totalCount;

        return {
          exportWHList,
          totalCount,
        };
      }

      return rejectWithValue('Get data fail');
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getGetDetail = createAsyncThunk(
  'exportCancel/getGetDetail',
  async (id: number, { rejectWithValue }) => {
    try {
      const { data } = await exportCancelService.getGetDetail(id);
      if (data) {
        const exportCancel = data;

        return {
          exportCancel,
        };
      }

      return rejectWithValue('Get data fail');
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const exportCancelSlice = createSlice({
  name: 'exportCancel',
  initialState,
  reducers: {},
  extraReducers: (builder) => {},
});

export default exportCancelSlice.reducer;
