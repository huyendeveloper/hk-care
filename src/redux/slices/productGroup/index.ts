import {
  createAsyncThunk,
  createSlice,
  isFulfilled,
  isPending,
  isRejected,
} from '@reduxjs/toolkit';
import { defaultFilters } from 'constants/defaultFilters';
import { stat } from 'fs';
import { IProductGroup } from 'interface';
import productGroupService from 'services/productGroup.service';
import { FilterParams } from 'types';

interface IInitialState {
  loading: boolean;
  filters: FilterParams;
}

const initialState: IInitialState = { loading: false, filters: defaultFilters };

export const getAllProductGroup = createAsyncThunk(
  'productGroup/getAll',
  async (filters: FilterParams, { rejectWithValue }) => {
    try {
      const { data } = await productGroupService.getAll(filters);

      if (data.items) {
        const productGroupList = data.items;
        const totalCount = data.totalCount;

        return {
          productGroupList,
          totalCount,
        };
      }

      return rejectWithValue('Get data fail');
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const deleteProductGroup = createAsyncThunk(
  'productGroup/delete',
  async (id: number, { rejectWithValue }) => {
    try {
      await productGroupService.delete(id);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const createProductGroup = createAsyncThunk(
  'productGroup/create',
  async (payload: IProductGroup, { rejectWithValue }) => {
    try {
      await productGroupService.create(payload);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateProductGroup = createAsyncThunk(
  'productGroup/update',
  async (payload: IProductGroup, { rejectWithValue }) => {
    try {
      await productGroupService.update(payload);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const productGroupSlice = createSlice({
  name: 'productGroup',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(createProductGroup.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(createProductGroup.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(createProductGroup.rejected, (state) => {
      state.loading = false;
    });

    builder.addCase(deleteProductGroup.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(deleteProductGroup.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(deleteProductGroup.rejected, (state) => {
      state.loading = false;
    });

    builder.addCase(updateProductGroup.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateProductGroup.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(updateProductGroup.rejected, (state) => {
      state.loading = false;
    });
  },
});

export default productGroupSlice.reducer;
