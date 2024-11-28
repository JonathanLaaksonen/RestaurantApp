import { FETCH_RESTAURANTS, SET_VISIT_STATUS } from './actions';

const initialState = {
  list: [],
};

export const restaurantsReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_RESTAURANTS:
      return {
        ...state,
        list: action.payload,
      };
    case SET_VISIT_STATUS:
      return {
        ...state,
        list: state.list.map((restaurant) => {
          if (restaurant.id === action.payload.id) {
            // Päivitetään ravintolan tila 'visited' ja 'toVisit' -kenttien mukaisesti
            return {
              ...restaurant,
              ...action.payload.status,
            };
          }
          return restaurant;
        }),
      };
    default:
      return state;
  }
};
