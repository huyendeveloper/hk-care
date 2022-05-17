import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ILogin } from 'interface';
import authService from 'services/auth.service';
import userService from 'services/user.service';
import { UserInfo } from 'types';
import LocalStorage from 'utils/LocalStorage';

interface IInitialState {
  userId: string | null;
  userRoles: string[];
  user: UserInfo | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
  accessToken: string | null;
}

const initialState: IInitialState = {
  userId: null,
  userRoles: [],
  user: null,
  isAuthenticated: false,
  isInitialized: false,
  accessToken: null,
};

export const login = createAsyncThunk(
  'auth/login',
  async (body: ILogin, { rejectWithValue }) => {
    try {
      const res = await authService.login(body);

      if (res.data.access_Token) {
        const access_Token = res.data.access_Token as string;
        const userId = res.data.userId as string;
        LocalStorage.set('accessToken', access_Token);
        const { data } = await userService.getRoles(userId);

        return {
          access_Token,
          userId,
          userRoles: data,
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
    logout: (state) => {
      LocalStorage.remove('accessToken');
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      login.fulfilled,
      (
        state,
        action: PayloadAction<{
          access_Token: string;
          userId: string;
          userRoles: string[];
        }>
      ) => {
        const access_Token = action.payload.access_Token;
        const userId = action.payload.userId;
        const userRoles = action.payload.userRoles;

        state.accessToken = access_Token;
        state.userId = userId;
        state.userRoles = userRoles;
        state.isAuthenticated = true;
        state.isInitialized = true;
      }
    );

    builder.addCase(login.rejected, (state) => {
      state.accessToken = null;
      state.userId = null;
      // state.isAuthenticated = false;
      state.isInitialized = true;
    });
  },
});

export const { updateRoles, logout } = authSlice.actions;
export default authSlice.reducer;
