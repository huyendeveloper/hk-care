import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import tenantService from 'services/tenant.service';

interface IInitialState {
  loading: boolean;
}

const initialState: IInitialState = { loading: false };

export const getTenants = createAsyncThunk('tenant/getTenants', async () => {
  try {
    const { data } = await tenantService.getTenants();

    if (data) {
      const tenants = data;

      return {
        tenants,
      };
    }
  } catch (error) {
    return error;
  }
});

const tenantSlice = createSlice({
  name: 'tenant',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getTenants.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getTenants.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(getTenants.rejected, (state) => {
      state.loading = false;
    });
  },
});

export default tenantSlice.reducer;
