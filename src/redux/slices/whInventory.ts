import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { IInventoryRecord } from 'interface';
import whInventoryService from 'services/whInventory.service';

interface IInitialState {}

const initialState: IInitialState = {};

export const createWhInventory = createAsyncThunk(
  'whInventory/create',
  async (payload: IInventoryRecord, { rejectWithValue }) => {
    try {
      const { data } = await whInventoryService.create(payload);
      return { id: data.id };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateWhInventory = createAsyncThunk(
  'whInventory/update',
  async (payload: IInventoryRecord, { rejectWithValue }) => {
    try {
      const { data } = await whInventoryService.update(payload);
      return { id: data.id };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const whInventorySlice = createSlice({
  name: 'whInventory',
  initialState,
  reducers: {},
  extraReducers: (builder) => {},
});

export default whInventorySlice.reducer;
