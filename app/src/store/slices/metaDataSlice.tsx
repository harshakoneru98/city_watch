// src/store/slices/mySlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { MetaDataState, MetaData } from '../../api/types';
import { getAxiosRequest } from '../../api';

const initialState: MetaDataState = {
  metaData: [],
  metaDataStatus: 'idle',
  metaDataError: null,
};

export const fetchMetaDataInfoData = createAsyncThunk(
  'crime/get_metadata_info/',
  async (endpoint: string) => {
    const response: MetaData[] = await getAxiosRequest(endpoint);
    return response;
  }
);

const metadataSlice = createSlice({
  name: 'metaDataInfo',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMetaDataInfoData.pending, (state) => {
        state.metaDataStatus = 'loading';
      })
      .addCase(fetchMetaDataInfoData.fulfilled, (state, action) => {
        state.metaDataStatus = 'succeeded';
        state.metaData = action.payload;
        state.metaDataError = null;
      })
      .addCase(fetchMetaDataInfoData.rejected, (state, action) => {
        state.metaDataStatus = 'failed';
        state.metaDataError = action.error.message || 'Fetching Metadata Failed';
      });
  },
});

export default metadataSlice.reducer;
