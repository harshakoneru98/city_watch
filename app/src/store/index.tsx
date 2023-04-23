// src/store/index.ts

import { configureStore } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
import metadataReducer from './slices/metadataSlice';
import zipdataReducer from './slices/zipdataSlice';
import crimedataReducer from './slices/crimedataSlice'
import topcrimedataReducer from './slices/topcrimedataSlice'
import housingcitiesdataReducer from './slices/housingcitiesdataSlice';
import housingdataReducer from './slices/housingdataSlice'
import userdataReducer from './slices/userdataSlice';
import updateuserdataReducer from './slices/updateuserdataSlice'

const store = configureStore({
  reducer: {
    metaDataInfo: metadataReducer,
    zipDataInfo: zipdataReducer,
    crimeDataInfo: crimedataReducer,
    topCrimeDataInfo: topcrimedataReducer,
    housingCitiesDataInfo: housingcitiesdataReducer,
    housingDataInfo: housingdataReducer,
    userDataInfo: userdataReducer,
    updateUserDataInfo: updateuserdataReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
