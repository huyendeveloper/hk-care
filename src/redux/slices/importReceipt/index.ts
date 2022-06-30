import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { IImportReceipt } from 'interface';
import importReceiptService from 'services/importReceipt.service';
import { FilterParams } from 'types';

interface IInitialState {
  loading: boolean;
}

const initialState: IInitialState = { loading: false };

export const getAllImportReceipt = createAsyncThunk(
  'importReceipt/getAll',
  async (filters: FilterParams, { rejectWithValue }) => {
    try {
      const { data } = await importReceiptService.getAll(filters);

      if (data.items) {
        const importReceiptList = data.items;
        const totalCount = data.totalCount;

        return {
          importReceiptList,
          totalCount,
        };
      }

      return rejectWithValue('Get data fail');
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getImportReceipt = createAsyncThunk(
  'importReceipt/get',
  async (id: number, { rejectWithValue }) => {
    try {
      const { data } = await importReceiptService.get(id);
      if (data) {
        const importReceipt = data;

        return {
          importReceipt,
        };
      }

      return rejectWithValue('Get data fail');
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateImportReceipt = createAsyncThunk(
  'importReceipt/update',
  async (payload: IImportReceipt, { rejectWithValue }) => {
    try {
      await importReceiptService.update(payload);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const createImportReceipt = createAsyncThunk(
  'importReceipt/create',
  async (payload: IImportReceipt, { rejectWithValue }) => {
    try {
      const { data } = await importReceiptService.create(payload);
      return { id: data.id };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// export const updateImportReceipt = createAsyncThunk(
//   'importReceipt/update',
//   async (payload: IImportReceipt, { rejectWithValue }) => {
//     const { image, ...data } = payload;
//     try {
//       await importReceiptService.update(data, image);
//     } catch (error) {
//       return rejectWithValue(error);
//     }
//   }
// );

// export const changeStatus = createAsyncThunk(
//   'importReceipt/changeStatus',
//   async (params: { id: number; status: boolean }, { rejectWithValue }) => {
//     const { id, status } = params;
//     try {
//       await importReceiptService.changeStatus(id, status);
//     } catch (error) {
//       return rejectWithValue(error);
//     }
//   }
// );

// export const deleteImportReceipt = createAsyncThunk(
//   'importReceipt/delete',
//   async (id: number, { rejectWithValue }) => {
//     try {
//       await importReceiptService.delete(id);
//     } catch (error) {
//       return rejectWithValue(error);
//     }
//   }
// );

const importReceiptSlice = createSlice({
  name: 'importReceipt',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // builder.addCase(getAllImportReceipt.pending, (state) => {
    //   state.loading = true;
    // });
    // builder.addCase(getAllImportReceipt.fulfilled, (state) => {
    //   state.loading = false;
    // });
    // builder.addCase(getAllImportReceipt.rejected, (state) => {
    //   state.loading = false;
    // });
  },
});

export default importReceiptSlice.reducer;
