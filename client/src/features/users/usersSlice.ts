import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GlobalError, OnlineUser, User, ValidationError } from '../../types';
import {googleLogin, login, register} from './usersThunks';


interface UsersState {
  user: User | null;
  onlineUsers: OnlineUser[];
  registerLoading: boolean;
  registerError: ValidationError | null;
  loginError: GlobalError | null;
  loginLoading: boolean;
}

const initialState: UsersState = {
  user: null,
  onlineUsers: [],
  registerError: null,
  registerLoading: false,
  loginError: null,
  loginLoading: false
};

export const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    unsetUser: (state) => {
      state.user = null;
    },
    setOnlineUsers: (state, action: PayloadAction<OnlineUser[]>) => {
      state.onlineUsers = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.registerLoading = true;
        state.registerError = null;
      })
      .addCase(register.fulfilled, (state, {payload: userResponse}) => {
        state.registerLoading = false;
        state.user = userResponse;
      })
      .addCase(register.rejected, (state, {payload: error}) => {
        state.registerLoading = false;
        state.registerError = error || null;
      })
      .addCase(login.pending, (state) => {
        state.loginLoading = true;
        state.loginError = null;
      })
      .addCase(login.fulfilled, (state, {payload: user}) => {
        state.user = user;
        state.loginLoading = false;
      })
      .addCase(login.rejected, (state, {payload: error}) => {
        state.loginLoading = false;
        state.loginError = error || null;
      })
      .addCase(googleLogin.pending, (state) => {
        state.loginLoading = true;
        state.loginError = null;
      })
      .addCase(googleLogin.fulfilled, (state, {payload: user}) => {
      state.loginLoading = false;
      state.user = user;
      })
      .addCase(googleLogin.rejected, (state, {payload: error}) => {
      state.loginLoading = false;
      state.loginError = error || null;
    });
  },
  selectors: {
    selectUser: (state) => state.user,
    selectOnlineUsers: (state) => state.onlineUsers,
    selectRegisterLoading: (state) => state.registerLoading,
    selectRegisterError: (state) => state.registerError,
    selectLoginLoading: (state) => state.loginLoading,
    selectLoginError: (state) => state.loginError,
  },
});

export const { unsetUser, setOnlineUsers } = usersSlice.actions;
export const {
  selectUser,
  selectOnlineUsers,
  selectRegisterLoading,
  selectRegisterError,
  selectLoginError
} = usersSlice.selectors;

export const usersReducer = usersSlice.reducer;