// src/store/slices/mySlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { CrimeDataState, CrimeData } from '../../api/types';
import { postAxiosRequest } from '../../api';

const initialState: CrimeDataState = {
  crimeData: [],
  crimeDataStatus: 'idle',
  crimeDataError: null,
};

export const fetchCrimeDataInfoData = createAsyncThunk(
  'crime/get_crimedata_info_by_year_zipcode',
  async (payload: { endpoint: string, year: string, zipcodes: string[] }) => {
    const { endpoint, year, zipcodes } = payload;
    const response: any = await postAxiosRequest(endpoint, JSON.stringify({year, zipcodes}));
    return response.data;
  }
);

const crimedataSlice = createSlice({
  name: 'crimeDataInfo',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCrimeDataInfoData.pending, (state) => {
        state.crimeDataStatus = 'loading';
      })
      .addCase(fetchCrimeDataInfoData.fulfilled, (state, action) => {
        state.crimeDataStatus = 'succeeded';
        state.crimeData = action.payload;
        state.crimeDataError = null;
      })
      .addCase(fetchCrimeDataInfoData.rejected, (state, action) => {
        state.crimeDataStatus = 'failed';
        state.crimeDataError = action.error.message || 'Fetching Crime Data Failed';
      });
  },
});

export default crimedataSlice.reducer;
