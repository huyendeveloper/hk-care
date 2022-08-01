import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { IUsage } from 'interface';
import usageService from 'services/usage.service';
import { FilterParams } from 'types';

interface IInitialState {}

const initialState: IInitialState = {};

export const getAllUsage = createAsyncThunk(
  'usage/getAll',
  async (filters: FilterParams, { rejectWithValue }) => {
    try {
      const { data } = await usageService.getAll(filters);

      if (data.items) {
        const usageList = data.items;
        const totalCount = data.totalCount;

        return {
          usageList,
          totalCount,
        };
      }

      return rejectWithValue('Error');
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const createUsage = createAsyncThunk(
  'usage/create',
  async (payload: IUsage, { rejectWithValue }) => {
    try {
      await usageService.create({
        ...payload,
        name: payload.name.trim(),
      });
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateUsage = createAsyncThunk(
  'usage/update',
  async (payload: IUsage, { rejectWithValue }) => {
    try {
      await usageService.update({
        ...payload,
        name: payload.name.trim(),
      });
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const deleteUsage = createAsyncThunk(
  'usage/delete',
  async (id: number, { rejectWithValue }) => {
    try {
      await usageService.delete(id);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const usageSlice = createSlice({
  name: 'usage',
  initialState,
  reducers: {},
  extraReducers: (builder) => {},
});

export default usageSlice.reducer;
