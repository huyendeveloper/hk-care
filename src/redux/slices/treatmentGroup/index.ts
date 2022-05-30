import {
  createAsyncThunk,
  createSlice,
  isFulfilled,
  isPending,
  isRejected,
} from '@reduxjs/toolkit';
import { ITreatmentGroup } from 'interface';
import treatmentGroupService from 'services/treatmentGroup.service';
import { FilterParams } from 'types';

interface IInitialState {
  loading: boolean;
}

const initialState: IInitialState = { loading: false };

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

      return rejectWithValue('Get data fail');
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

export const createTreatmentGroup = createAsyncThunk(
  'treatmentGroup/create',
  async (payload: ITreatmentGroup, { rejectWithValue }) => {
    try {
      await treatmentGroupService.create(payload);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateTreatmentGroup = createAsyncThunk(
  'treatmentGroup/update',
  async (payload: ITreatmentGroup, { rejectWithValue }) => {
    try {
      await treatmentGroupService.update(payload);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const treatmentGroupSlice = createSlice({
  name: 'treatmentGroup',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllTreatmentGroup.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getAllTreatmentGroup.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(getAllTreatmentGroup.rejected, (state) => {
      state.loading = false;
    });
  },
});

export default treatmentGroupSlice.reducer;
