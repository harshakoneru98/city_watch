// src/store/index.ts

import { configureStore } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
import metadataReducer from './slices/metadataSlice';
import zipdataReducer from './slices/zipdataSlice';
import crimedataReducer from './slices/crimedataSlice'
import topcrimedataReducer from './slices/topcrimedataSlice'
import housingcitiesdataReducer from './slices/housingcitiesdataSlice';
import housingdataReducer from './slices/housingdataSlice'

const store = configureStore({
  reducer: {
    metaDataInfo: metadataReducer,
    zipDataInfo: zipdataReducer,
    crimeDataInfo: crimedataReducer,
    topCrimeDataInfo: topcrimedataReducer,
    housingCitiesDataInfo: housingcitiesdataReducer,
    housingDataInfo: housingdataReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
