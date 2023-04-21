// src/store/slices/mySlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Top5RecentCrimeDataState } from '../../api/types';
import { postAxiosRequest } from '../../api';

const initialState: Top5RecentCrimeDataState = {
  top5RecentCrimeData: {},
  top5RecentCrimeDataStatus: 'idle',
  top5RecentCrimeDataError: null,
};

export const fetchTop5CrimeDataInfoData = createAsyncThunk(
  'crime/get_top5_crimedata_by_zipcode',
  async (payload: { endpoint: string, zipcodes: string[], desiredCrimes: string[] }) => {
    const { endpoint, zipcodes, desiredCrimes } = payload;
    const response: any = await postAxiosRequest(endpoint, JSON.stringify({zipcodes, desiredCrimes}));
    return response;
  }
);

const topcrimedataSlice = createSlice({
  name: 'topCrimeDataInfo',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTop5CrimeDataInfoData.pending, (state) => {
        state.top5RecentCrimeDataStatus = 'loading';
      })
      .addCase(fetchTop5CrimeDataInfoData.fulfilled, (state, action) => {
        state.top5RecentCrimeDataStatus = 'succeeded';
        state.top5RecentCrimeData = action.payload;
        state.top5RecentCrimeDataError = null;
      })
      .addCase(fetchTop5CrimeDataInfoData.rejected, (state, action) => {
        state.top5RecentCrimeDataStatus = 'failed';
        state.top5RecentCrimeDataError = action.error.message || 'Fetching Top 5 Crime Data Failed';
      });
  },
});

export default topcrimedataSlice.reducer;
