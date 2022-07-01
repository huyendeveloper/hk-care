import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { IProductGroup } from 'interface';
import productGroupService from 'services/productGroup.service';
import { FilterParams } from 'types';

interface IInitialState {}

const initialState: IInitialState = {};

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

      return rejectWithValue('Error');
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const createProductGroup = createAsyncThunk(
  'productGroup/create',
  async (payload: IProductGroup, { rejectWithValue }) => {
    try {
      await productGroupService.create({
        ...payload,
        name: payload.name.trim(),
      });
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateProductGroup = createAsyncThunk(
  'productGroup/update',
  async (payload: IProductGroup, { rejectWithValue }) => {
    try {
      await productGroupService.update({
        ...payload,
        name: payload.name.trim(),
      });
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

const productGroupSlice = createSlice({
  name: 'productGroup',
  initialState,
  reducers: {},
  extraReducers: (builder) => {},
});

export default productGroupSlice.reducer;
