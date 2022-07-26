import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { IImportReceipt } from 'interface';
import expectedService from 'services/expected.service';
import { FilterParams } from 'types';

interface IInitialState {}

const initialState: IInitialState = {};

export const getAllExpected = createAsyncThunk(
  'expected/getAllExpected',
  async (filters: FilterParams, { rejectWithValue }) => {
    try {
      const { data } = await expectedService.getAll(filters);

      if (data) {
        const expectedList = data.items;
        const totalCount = data.totalCount;

        return {
          expectedList,
          totalCount,
        };
      }

      return rejectWithValue('Get data fail');
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const addExpectedDetails = createAsyncThunk(
  'expected/addExpectedDetails',
  async () => {
    try {
      const { data } = await expectedService.addExpectedDetails();

      if (data) {
        const expectedList = data;

        return {
          expectedList,
        };
      }
    } catch (error) {
      return error;
    }
  }
);

export const createExpected = createAsyncThunk(
  'expected/create',
  async (payload: IImportReceipt, { rejectWithValue }) => {
    try {
      const { data } = await expectedService.create(payload);
      return { id: data };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getExpected = createAsyncThunk(
  'expected/getExpected',
  async (payload: string, { rejectWithValue }) => {
    try {
      const { data } = await expectedService.getExpected(payload);
      console.log('data', data);
      return { expected: data };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const expectedSlice = createSlice({
  name: 'expected',
  initialState,
  reducers: {},
  extraReducers: (builder) => {},
});

export default expectedSlice.reducer;
