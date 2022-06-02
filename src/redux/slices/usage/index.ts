import {
  createAsyncThunk,
  createSlice,
  isFulfilled,
  isPending,
  isRejected,
} from '@reduxjs/toolkit';
import { IUsage } from 'interface';
import usageService from 'services/usage.service';
import { FilterParams } from 'types';

interface IInitialState {
  loading: boolean;
}

const initialState: IInitialState = { loading: false };

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

      return rejectWithValue('Get data fail');
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

export const createUsage = createAsyncThunk(
  'usage/create',
  async (payload: IUsage, { rejectWithValue }) => {
    try {
      await usageService.create(payload);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateUsage = createAsyncThunk(
  'usage/update',
  async (payload: IUsage, { rejectWithValue }) => {
    try {
      await usageService.update(payload);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const usageSlice = createSlice({
  name: 'usage',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllUsage.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getAllUsage.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(getAllUsage.rejected, (state) => {
      state.loading = false;
    });
  },
});

export default usageSlice.reducer;
