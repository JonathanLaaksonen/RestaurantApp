import { configureStore } from '@reduxjs/toolkit';
import { restaurantsReducer } from './reducers';

const store = configureStore({
  reducer: {
    restaurants: restaurantsReducer,
  },
});

export default store;