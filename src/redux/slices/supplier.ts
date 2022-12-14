import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { ISupplier } from 'interface';
import supplierService from 'services/supplier.service';
import { FilterParams } from 'types';

interface IInitialState {}

const initialState: IInitialState = {};

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

export const getSupplier = createAsyncThunk(
  'supplier/get',
  async (id: number, { rejectWithValue }) => {
    try {
      const { data } = await supplierService.get(id);
      if (data) {
        const supplier = data;

        return {
          supplier,
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
    const { files, ...data } = payload;
    try {
      await supplierService.create(data, files || []);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateSupplier = createAsyncThunk(
  'supplier/update',
  async (payload: ISupplier, { rejectWithValue }) => {
    const { files, ...data } = payload;
    try {
      await supplierService.update(data, files || []);
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

export const deleteSupplier = createAsyncThunk(
  'supplier/delete',
  async (id: number, { rejectWithValue }) => {
    try {
      await supplierService.delete(id);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const supplierSlice = createSlice({
  name: 'supplier',
  initialState,
  reducers: {},
  extraReducers: (builder) => {},
});

export default supplierSlice.reducer;
