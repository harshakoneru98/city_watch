// src/store/slices/mySlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { HousingCitiesDataState } from '../../api/types';
import { getAxiosRequest } from '../../api';

const initialState: HousingCitiesDataState = {
  housingCitiesData: [],
  housingCitiesDataStatus: 'idle',
  housingCitiesDataError: null,
};

export const fetchHousingCitiesDataInfoData = createAsyncThunk(
  'housing/get_housing_cities_info/',
  async (endpoint: string) => {
    const response: string[] = await getAxiosRequest(endpoint);
    return response;
  }
);

const housingcitiesdataSlice = createSlice({
  name: 'housingCitiesDataInfo',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHousingCitiesDataInfoData.pending, (state) => {
        state.housingCitiesDataStatus = 'loading';
      })
      .addCase(fetchHousingCitiesDataInfoData.fulfilled, (state, action) => {
        state.housingCitiesDataStatus = 'succeeded';
        state.housingCitiesData = action.payload;
        state.housingCitiesDataError = null;
      })
      .addCase(fetchHousingCitiesDataInfoData.rejected, (state, action) => {
        state.housingCitiesDataStatus = 'failed';
        state.housingCitiesDataError = action.error.message || 'Fetching Metadata Failed';
      });
  },
});

export default housingcitiesdataSlice.reducer;
