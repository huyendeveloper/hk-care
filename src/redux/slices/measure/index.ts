import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { IMeasure } from 'interface';
import measureService from 'services/measure.service';
import { FilterParams } from 'types';

interface IInitialState {
  loading: boolean;
}

const initialState: IInitialState = { loading: false };

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

      return rejectWithValue('Get data fail');
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const createMeasure = createAsyncThunk(
  'measure/create',
  async (payload: IMeasure, { rejectWithValue }) => {
    try {
      await measureService.create(payload);
      return rejectWithValue('Get data fail');
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const measureSlice = createSlice({
  name: 'measure',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllMeasure.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(getAllMeasure.fulfilled, (state) => {
      state.loading = false;
    });

    builder.addCase(getAllMeasure.rejected, (state) => {
      state.loading = false;
    });

    builder.addCase(createMeasure.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(createMeasure.fulfilled, (state) => {
      state.loading = false;
    });

    builder.addCase(createMeasure.rejected, (state) => {
      state.loading = false;
    });
  },
});

export default measureSlice.reducer;
