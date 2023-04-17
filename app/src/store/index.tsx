// src/store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
import metadataReducer from './slices/metadataSlice';

const store = configureStore({
  reducer: {
    metaDataInfo: metadataReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
