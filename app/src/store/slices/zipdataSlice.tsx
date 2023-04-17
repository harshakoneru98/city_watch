// src/store/slices/mySlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ZipDataState } from '../../api/types';
import { postAxiosRequest } from '../../api';

const initialState: ZipDataState = {
  zipData: {},
  zipDataStatus: 'idle',
  zipDataError: null,
};

export const fetchZipDataInfoData = createAsyncThunk(
  'crime/get_yearly_zipcodes_info_by_city',
  async (payload: { endpoint: string, city: string }) => {
    const { endpoint, city } = payload;
    const response: any = await postAxiosRequest(endpoint, JSON.stringify({city}));
    return response;
  }
);

const zipdataSlice = createSlice({
  name: 'zipDataInfo',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchZipDataInfoData.pending, (state) => {
        state.zipDataStatus = 'loading';
      })
      .addCase(fetchZipDataInfoData.fulfilled, (state, action) => {
        state.zipDataStatus = 'succeeded';
        state.zipData = action.payload;
        state.zipDataError = null;
      })
      .addCase(fetchZipDataInfoData.rejected, (state, action) => {
        state.zipDataStatus = 'failed';
        state.zipDataError = action.error.message || 'Fetching ZipData Failed';
      });
  },
});

export default zipdataSlice.reducer;
