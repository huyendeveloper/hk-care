import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import revenueReportService from 'services/revenueReport.service';
import { FilterParams } from 'types';

interface IInitialState {}

const initialState: IInitialState = {};

export const getRevenueReportByUser = createAsyncThunk(
  'revenueReport/getRevenueReportByUser',
  async (filters: FilterParams, { rejectWithValue }) => {
    try {
      const { data } = await revenueReportService.getRevenueReportByUser(
        filters
      );

      if (data.items) {
        const revenueReport = data.items;
        const totalCount = data.totalCount;
        const totalRevenue = data.totalRevenue;

        return {
          revenueReport,
          totalCount,
          totalRevenue,
        };
      }

      return rejectWithValue('Get data fail');
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getRevenueReportAll = createAsyncThunk(
  'revenueReport/getRevenueReportAll',
  async (filters: FilterParams, { rejectWithValue }) => {
    try {
      const { data } = await revenueReportService.getRevenueReportAll(filters);

      if (data.items) {
        const revenueReport = data.items;
        const totalCount = data.totalCount;
        const totalRevenue = data.totalRevenue;

        return {
          revenueReport,
          totalCount,
          totalRevenue,
        };
      }

      return rejectWithValue('Get data fail');
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const revenueReportSlice = createSlice({
  name: 'revenueReport',
  initialState,
  reducers: {},
  extraReducers: (builder) => {},
});

export default revenueReportSlice.reducer;
