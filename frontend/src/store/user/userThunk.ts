import { createAsyncThunk } from '@reduxjs/toolkit';
import { camelize } from '../camelizer';
import { UserInfo } from '../../models/model';
import { RootState } from '..';
import { LoadingState } from '../appStatusSlice';

const API_URL = import.meta.env.VITE_API_URL;

const userThunk = {
  loadUserInfo: createAsyncThunk<
    UserInfo,
    {},
    {
      state: RootState;
    }
  >(
    'user/loadUserInfo',
    async ({}, { getState, rejectWithValue }) => {
      try {
        const { loading } = getState().appStatus;
        if (loading !== LoadingState.PENDING) {
          return rejectWithValue(undefined);
        }

        const response = await fetch(`${API_URL}/api/v1/users/`, {
          credentials: 'include',
        });
        if (response.ok)
          return camelize(await response.json()) as UserInfo;
        throw new Error();
      } catch (error) {
        return rejectWithValue('Failed to fetch user info!');
      }
    }
  ),
};

export default userThunk;
