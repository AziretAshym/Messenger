import {createAsyncThunk} from '@reduxjs/toolkit';
import {isAxiosError} from 'axios';
import {GlobalError, LoginMutation, RegisterMutation, RegisterResponse, User, ValidationError} from '../../types';
import axiosApi from '../../axiosApi';
import {RootState} from '../../app/store';


export const register = createAsyncThunk<User, RegisterMutation,
  { rejectValue: ValidationError }
>(
  'users/register',
  async (registerMutation: RegisterMutation, {rejectWithValue}) => {
    try {
      const formData = new FormData();
      const keys = Object.keys(registerMutation) as (keyof typeof registerMutation)[];
      keys.forEach((key) => {
        const value = registerMutation[key];
        if (value !== null) {
          formData.append(key, value);
        }
      });
      const response = await axiosApi.post<User>('/users/register', formData);
      return response.data;
    } catch (e) {
      if (isAxiosError(e) && e.response && e.response.status === 400) {
        return rejectWithValue(e.response.data);
      }
      throw e;
    }
  }
);

export const login = createAsyncThunk<User, LoginMutation, { rejectValue: GlobalError }>(
  'users/login',
  async (loginMutation: LoginMutation, {rejectWithValue}) => {
    try {
      const response = await axiosApi.post<RegisterResponse>('users/sessions', loginMutation);

      return response.data.user;
    } catch (e) {
      if (isAxiosError(e) && e.response && e.response.status === 400) {
        return rejectWithValue(e.response.data as GlobalError);
      }
      throw e;
    }
  }
);

export const logout = createAsyncThunk<void, void, { state: RootState }>(
  'users/logout',
  async (_, {getState}) => {
    const token = getState().users.user?.token;
    await axiosApi.delete('/users/sessions', {headers: {'Authorization': token}});
  }
);

export const googleLogin = createAsyncThunk<User, string, { rejectValue: GlobalError }>(
  'users/googleLogin',
  async (credential, {rejectWithValue}) => {
    try {
      const response = await axiosApi.post('/users/google', {credential});
      return response.data.user;
    } catch (error) {
      if (isAxiosError<GlobalError>(error) && error.response && error.response.status === 400) {
        return rejectWithValue(error.response.data);
      }
      throw error;
    }
  });
