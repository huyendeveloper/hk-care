import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { ITreatmentGroup } from 'interface';
import treatmentGroupService from 'services/treatmentGroup.service';
import { FilterParams } from 'types';

interface IInitialState {}

const initialState: IInitialState = {};

export const getAllTreatmentGroup = createAsyncThunk(
  'treatmentGroup/getAll',
  async (filters: FilterParams, { rejectWithValue }) => {
    try {
      const { data } = await treatmentGroupService.getAll(filters);

      if (data.items) {
        const treatmentGroupList = data.items;
        const totalCount = data.totalCount;

        return {
          treatmentGroupList,
          totalCount,
        };
      }

      return rejectWithValue('Error');
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const createTreatmentGroup = createAsyncThunk(
  'treatmentGroup/create',
  async (payload: ITreatmentGroup, { rejectWithValue }) => {
    try {
      await treatmentGroupService.create({
        ...payload,
        name: payload.name.trim(),
      });
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateTreatmentGroup = createAsyncThunk(
  'treatmentGroup/update',
  async (payload: ITreatmentGroup, { rejectWithValue }) => {
    try {
      await treatmentGroupService.update({
        ...payload,
        name: payload.name.trim(),
      });
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const deleteTreatmentGroup = createAsyncThunk(
  'treatmentGroup/delete',
  async (id: number, { rejectWithValue }) => {
    try {
      await treatmentGroupService.delete(id);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const treatmentGroupSlice = createSlice({
  name: 'treatmentGroup',
  initialState,
  reducers: {},
  extraReducers: (builder) => {},
});

export default treatmentGroupSlice.reducer;
