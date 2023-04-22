// src/store/slices/mySlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { HousingInfoDataState } from '../../api/types';
import { postAxiosRequest } from '../../api';

const initialState: HousingInfoDataState = {
  housingInfoData: {},
  housingInfoDataStatus: 'idle',
  housingInfoDataError: null,
};

export const fetchHousingDataInfoData = createAsyncThunk(
  'housing/get_housing_recommendation_info',
  async (payload: { endpoint: string, cities: any, persqrt_range: any }) => {
    const { endpoint, cities, persqrt_range } = payload;
    const response: any = await postAxiosRequest(endpoint, JSON.stringify({cities, persqrt_range}));
    return response;
  }
);

const housingdataSlice = createSlice({
  name: 'housingDataInfo',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHousingDataInfoData.pending, (state) => {
        state.housingInfoDataStatus = 'loading';
      })
      .addCase(fetchHousingDataInfoData.fulfilled, (state, action) => {
        state.housingInfoDataStatus = 'succeeded';
        state.housingInfoData = action.payload;
        state.housingInfoDataError = null;
      })
      .addCase(fetchHousingDataInfoData.rejected, (state, action) => {
        state.housingInfoDataStatus = 'failed';
        state.housingInfoDataError = action.error.message || 'Fetching Housing Info Data Failed';
      });
  },
});

export default housingdataSlice.reducer;
