import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { IExportWHRotation } from 'interface';
import exportWHRotationService from 'services/exportWHRotation.service';
import { FilterParams } from 'types';

interface IInitialState {}

const initialState: IInitialState = {};

export const getAllProduct = createAsyncThunk(
  'exportWHRotation/getAllProduct',
  async (filters: FilterParams, { rejectWithValue }) => {
    try {
      const { data } = await exportWHRotationService.getProductList(filters);

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
  'exportWHRotation/create',
  async (payload: IExportWHRotation, { rejectWithValue }) => {
    try {
      await exportWHRotationService.create(payload);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateExportWH = createAsyncThunk(
  'exportWHRotation/update',
  async (payload: IExportWHRotation, { rejectWithValue }) => {
    try {
      await exportWHRotationService.update(payload);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getAllExportWHRotation = createAsyncThunk(
  'exportWHRotation/getAll',
  async (filters: FilterParams, { rejectWithValue }) => {
    try {
      const { data } = await exportWHRotationService.getAll(filters);

      if (data.items) {
        const exportWHRotation = data.items;
        const totalCount = data.totalCount;

        return {
          exportWHRotation,
          totalCount,
        };
      }

      return rejectWithValue('Get data fail');
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getDetailExportWHRotation = createAsyncThunk(
  'exportWHRotation/getDetail',
  async (
    { id, childId }: { id: number; childId: number },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await exportWHRotationService.getDetail(id, childId);
      if (data) {
        const exportWHRotation = data;

        return {
          exportWHRotation,
        };
      }

      return rejectWithValue('Get data fail');
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const exportWHRotationSlice = createSlice({
  name: 'exportWHRotation',
  initialState,
  reducers: {},
  extraReducers: (builder) => {},
});

export default exportWHRotationSlice.reducer;
