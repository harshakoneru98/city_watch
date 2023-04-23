// src/store/slices/mySlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { UserDataState } from '../../api/types';
import { postAxiosRequest } from '../../api';

const initialState: UserDataState = {
  userData: {},
  userDataStatus: 'idle',
  userDataError: null,
};

export const fetchUserDataInfoData = createAsyncThunk(
  'user/get_user_data',
  async (payload: { endpoint: string, userId: any }) => {
    const { endpoint, userId } = payload;
    const response: any = await postAxiosRequest(endpoint, JSON.stringify({userId}));
    return response;
  }
);

const userdataSlice = createSlice({
  name: 'userDataInfo',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserDataInfoData.pending, (state) => {
        state.userDataStatus = 'loading';
      })
      .addCase(fetchUserDataInfoData.fulfilled, (state, action) => {
        state.userDataStatus = 'succeeded';
        state.userData = action.payload;
        state.userDataError = null;
      })
      .addCase(fetchUserDataInfoData.rejected, (state, action) => {
        state.userDataStatus = 'failed';
        state.userDataError = action.error.message || 'Fetching UserData Failed';
      });
  },
});

export default userdataSlice.reducer;
