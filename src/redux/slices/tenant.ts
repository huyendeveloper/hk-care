import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import salePointService from 'services/salePoint.service';
import tenantService from 'services/tenant.service';
import { SalePointDto } from 'views/HK_Group/Tenant/dto/salePointDto';

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

export const changeStatus = createAsyncThunk(
  'tenant/changeStatus',
  async (params: { id: number }, { rejectWithValue }) => {
    const { id } = params;
    try {
      await tenantService.changeStatus(id);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const createSalePoint = createAsyncThunk(
  'auth/create',
  async (body: SalePointDto, { rejectWithValue }) => {
    try {
      const res = await salePointService.create(body);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateSalePoint = createAsyncThunk(
  'auth/update',
  async (body: SalePointDto, { rejectWithValue }) => {
    try {
      const { data } = await salePointService.updateMoreInfo(body, body.id);

      return {
        data,
      };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

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
