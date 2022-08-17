import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { IUser } from 'interface';
import userService from 'services/user.service';
import { FilterParams } from 'types';

interface IInitialState {}

const initialState: IInitialState = {};

export const getAllUser = createAsyncThunk(
  'user/getAllUser',
  async (filters: FilterParams, { rejectWithValue }) => {
    try {
      const { data } = await userService.getAll(filters);

      if (data) {
        const userList = data.items;
        const totalCount = data.totalCount;

        return {
          userList,
          totalCount,
        };
      }

      return rejectWithValue('Get data fail');
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const createUser = createAsyncThunk(
  'user/create',
  async (payload: IUser, { rejectWithValue }) => {
    try {
      const { data } = await userService.create(payload);
      return { id: data.id };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateUser = createAsyncThunk(
  'user/update',
  async (payload: IUser, { rejectWithValue }) => {
    try {
      const { data } = await userService.update(payload);
      return { id: data.id };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {},
});

export default userSlice.reducer;
