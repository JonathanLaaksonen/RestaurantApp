import { createStore, combineReducers } from 'redux';
import { restaurantsReducer } from './reducers';

const rootReducer = combineReducers({
  restaurants: restaurantsReducer,
});

const store = createStore(rootReducer);

export default store;
