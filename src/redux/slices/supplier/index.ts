import {
  createAsyncThunk,
  createSlice,
  isPending,
  isFulfilled,
  isRejected,
} from '@reduxjs/toolkit';
import { ISupplier } from 'interface';
import supplierService from 'services/supplier.service';
import { FilterParams } from 'types';

interface IInitialState {
  loading: boolean;
}

const initialState: IInitialState = { loading: false };

export const getAllSupplier = createAsyncThunk(
  'supplier/getAll',
  async (filters: FilterParams, { rejectWithValue }) => {
    try {
      const { data } = await supplierService.getAll(filters);

      if (data.items) {
        const supplierList = data.items;
        const totalCount = data.totalCount;

        return {
          supplierList,
          totalCount,
        };
      }

      return rejectWithValue('Get data fail');
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const createSupplier = createAsyncThunk(
  'supplier/create',
  async (payload: ISupplier, { rejectWithValue }) => {
    const { fileValue, ...data } = payload;
    try {
      await supplierService.create(data, fileValue);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateSupplier = createAsyncThunk(
  'supplier/update',
  async (payload: ISupplier, { rejectWithValue }) => {
    const { fileValue, ...data } = payload;
    try {
      await supplierService.update(data, fileValue);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const changeStatus = createAsyncThunk(
  'supplier/changeStatus',
  async (params: { id: number; status: 1 | 2 }, { rejectWithValue }) => {
    const { id, status } = params;
    try {
      await supplierService.changeStatus(id, status);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const supplierSlice = createSlice({
  name: 'supplier',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllSupplier.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getAllSupplier.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(getAllSupplier.rejected, (state) => {
      state.loading = false;
    });
  },
});

export default supplierSlice.reducer;
