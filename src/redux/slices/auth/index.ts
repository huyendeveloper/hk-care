import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ILogin, IUser } from 'interface';
import authService from 'services/auth.service';
import LocalStorage from 'utils/LocalStorage';

interface IInitialState {
  userId: string | null;
  userRoles: string[];
}

const initialState: IInitialState = {
  userId: null,
  userRoles: [],
};

export const login = createAsyncThunk(
  'auth/login',
  async (body: ILogin, { rejectWithValue }) => {
    try {
      const res = await authService.login(body);

      if (res.data.access_Token) {
        const access_Token = res.data.access_Token as string;
        const userId = res.data.userId as string;
        return {
          access_Token,
          userId,
        };
      }
      return rejectWithValue('Login fail');
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    updateRoles: (state, action: PayloadAction<string[]>) => {
      state.userRoles = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      login.fulfilled,
      (
        state,
        action: PayloadAction<{ access_Token: string; userId: string }>
      ) => {
        const access_Token = action.payload.access_Token;
        const userId = action.payload.userId;

        LocalStorage.set('access_Token', access_Token);
        state.userId = userId;
      }
    );

    builder.addCase(login.rejected, (state) => {
      LocalStorage.remove('access_Token');
      state.userId = null;
    });
  },
});

export const { updateRoles } = authSlice.actions;
export default authSlice.reducer;
