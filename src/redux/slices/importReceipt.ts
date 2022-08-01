import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { IImportReceipt } from 'interface';
import importReceiptService from 'services/importReceipt.service';
import { FilterParams } from 'types';

interface IInitialState {}

const initialState: IInitialState = {};

export const getAllImportReceipt = createAsyncThunk(
  'importReceipt/getAll',
  async (filters: FilterParams, { rejectWithValue }) => {
    try {
      const { data } = await importReceiptService.getAll(filters);

      if (data.items) {
        const importReceiptList = data.items;
        const totalCount = data.totalCount;

        return {
          importReceiptList,
          totalCount,
        };
      }

      return rejectWithValue('Get data fail');
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getImportReceipt = createAsyncThunk(
  'importReceipt/get',
  async (id: number, { rejectWithValue }) => {
    try {
      const { data } = await importReceiptService.get(id);
      if (data) {
        const importReceipt = data;

        return {
          importReceipt,
        };
      }

      return rejectWithValue('Get data fail');
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateImportReceipt = createAsyncThunk(
  'importReceipt/update',
  async (payload: IImportReceipt, { rejectWithValue }) => {
    try {
      await importReceiptService.update(payload);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const createImportReceipt = createAsyncThunk(
  'importReceipt/create',
  async (payload: IImportReceipt, { rejectWithValue }) => {
    try {
      const { data } = await importReceiptService.create(payload);
      return { id: data.id };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const importReceiptSlice = createSlice({
  name: 'importReceipt',
  initialState,
  reducers: {},
  extraReducers: (builder) => {},
});

export default importReceiptSlice.reducer;
