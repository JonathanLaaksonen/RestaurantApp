export const FETCH_RESTAURANTS = 'FETCH_RESTAURANTS';
export const SET_VISIT_STATUS = 'SET_VISIT_STATUS';

export const fetchRestaurants = () => {
  return {
    type: FETCH_RESTAURANTS,
    payload: [
      { id: '1', name: 'Restaurant A', location: 'Location A', visited: false },
      { id: '2', name: 'Restaurant B', location: 'Location B', visited: true },
      // Lisää esimerkkidataa
    ],
  };
};

export const setVisitStatus = (id) => {
  return {
    type: SET_VISIT_STATUS,
    payload: id,
  };
};