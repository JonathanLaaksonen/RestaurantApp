import axios from 'axios';

export const FETCH_RESTAURANTS = 'FETCH_RESTAURANTS';
export const SET_VISIT_STATUS = 'SET_VISIT_STATUS';

const YELP_API_KEY = 'HIhJfPu2_FgcG7h8dJQm93uM5-Yh70zXL-80s_T-rYjb3RwcQpuCl0UlRCtB-NJQkX_KPhw-VHXEoVLZbFEJzHNTqZjawToycsQ4jl9oKE-JE8fyiOCWLQb1qrhFZ3Yx';

export const fetchRestaurants = (searchTerm) => {
  return async (dispatch) => {
    try {
      const response = await axios.get('https://api.yelp.com/v3/businesses/search', {
        headers: {
          Authorization: `Bearer ${YELP_API_KEY}`,
        },
        params: {
          term: searchTerm,
          location: 'Helsinki', // Replace with your desired location or make it dynamic
          limit: 10,
        },
      });

      const restaurants = response.data.businesses.map((business) => ({
        id: business.id,
        name: business.name,
        location: business.location.address1,
        visited: false,
      }));

      dispatch({
        type: FETCH_RESTAURANTS,
        payload: restaurants,
      });
    } catch (error) {
      console.error('Error fetching restaurants:', error);
    }
  };
};

export const setVisitStatus = (id) => {
  return {
    type: SET_VISIT_STATUS,
    payload: id,
  };
};