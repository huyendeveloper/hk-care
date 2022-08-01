import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { IMeasure } from 'interface';
import measureService from 'services/measure.service';
import { FilterParams } from 'types';

interface IInitialState {}

const initialState: IInitialState = {};

export const getAllMeasure = createAsyncThunk(
  'measure/getAll',
  async (filters: FilterParams, { rejectWithValue }) => {
    try {
      const { data } = await measureService.getAll(filters);

      if (data.items) {
        const measureList = data.items;
        const totalCount = data.totalCount;

        return {
          measureList,
          totalCount,
        };
      }

      return rejectWithValue('Error');
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const createMeasure = createAsyncThunk(
  'measure/create',
  async (payload: IMeasure, { rejectWithValue }) => {
    try {
      await measureService.create({
        ...payload,
        name: payload.name.trim(),
      });
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateMeasure = createAsyncThunk(
  'measure/update',
  async (payload: IMeasure, { rejectWithValue }) => {
    try {
      await measureService.update({
        ...payload,
        name: payload.name.trim(),
      });
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const deleteMeasure = createAsyncThunk(
  'measure/delete',
  async (id: number, { rejectWithValue }) => {
    try {
      await measureService.delete(id);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const measureSlice = createSlice({
  name: 'measure',
  initialState,
  reducers: {},
  extraReducers: (builder) => {},
});

export default measureSlice.reducer;
