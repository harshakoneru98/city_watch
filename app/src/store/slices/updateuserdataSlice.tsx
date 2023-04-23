import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { UpdateUserDataState } from '../../api/types';
import { postAxiosRequest } from '../../api';

const initialState: UpdateUserDataState = {
  updateUserData: {},
  updateUserDataStatus: 'idle',
  updateUserDataError: null,
};

export const fetchUpdateUserDataInfoData = createAsyncThunk(
  'user/update_user_data',
  async (payload: { endpoint: string, userId: string, firstName: string, lastName: string, city_located: string }) => {
    const { endpoint, userId, firstName, lastName, city_located } = payload;
    const response: any = await postAxiosRequest(endpoint, JSON.stringify({userId, firstName, lastName, city_located}));
    return response;
  }
);

const updateuserdataSlice = createSlice({
  name: 'updateUserDataInfo',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUpdateUserDataInfoData.pending, (state) => {
        state.updateUserDataStatus = 'loading';
      })
      .addCase(fetchUpdateUserDataInfoData.fulfilled, (state, action) => {
        state.updateUserDataStatus = 'succeeded';
        state.updateUserData = action.payload;
        state.updateUserDataError = null;
      })
      .addCase(fetchUpdateUserDataInfoData.rejected, (state, action) => {
        state.updateUserDataStatus = 'failed';
        state.updateUserDataError = action.error.message || 'Updating User Data Failed';
      });
  },
});

export default updateuserdataSlice.reducer;
