import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { IStaff } from 'interface';
import staffService from 'services/staff.service';
import userService from 'services/user.service';
import { FilterParams } from 'types';

interface IInitialState {}

const initialState: IInitialState = {};

export const getAllStaff = createAsyncThunk(
  'staff/getAll',
  async (filters: FilterParams, { rejectWithValue }) => {
    try {
      const { data } = await staffService.getAll(filters);

      if (data.items) {
        const staffList = data.items;
        const totalCount = data.totalCount;

        return {
          staffList,
          totalCount,
        };
      }

      return rejectWithValue('Get data fail');
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getStaff = createAsyncThunk(
  'staff/get',
  async (id: string, { rejectWithValue }) => {
    try {
      const { data } = await staffService.get(id);
      if (data) {
        const staff = data;

        return {
          staff,
        };
      }

      return rejectWithValue('Get data fail');
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getUser = createAsyncThunk(
  'staff/getUser',
  async (id: string, { rejectWithValue }) => {
    try {
      const { data } = await userService.get(id);
      if (data) {
        const user = data;

        return {
          user,
        };
      }

      return rejectWithValue('Get data fail');
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const createStaff = createAsyncThunk(
  'staff/create',
  async (payload: IStaff, { rejectWithValue }) => {
    try {
      await staffService.create(payload);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateStaff = createAsyncThunk(
  'staff/update',
  async (payload: IStaff, { rejectWithValue }) => {
    try {
      await staffService.update(payload);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const changeStatus = createAsyncThunk(
  'staff/changeStatus',
  async (params: { id: number }, { rejectWithValue }) => {
    const { id } = params;
    try {
      await staffService.changeStatus(id);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const changeStatusUser = createAsyncThunk(
  'staff/changeStatusUser',
  async (params: { id: number }, { rejectWithValue }) => {
    const { id } = params;
    try {
      await userService.changeStatus(id);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// export const deleteStaff = createAsyncThunk(
//   'staff/delete',
//   async (id: number, { rejectWithValue }) => {
//     try {
//       await staffService.delete(id);
//     } catch (error) {
//       return rejectWithValue(error);
//     }
//   }
// );

const staffSlice = createSlice({
  name: 'staff',
  initialState,
  reducers: {},
  extraReducers: (builder) => {},
});

export default staffSlice.reducer;
