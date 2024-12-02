import axios from 'axios';
import { db } from '../firebase/FirebaseConfig';
import { ref, set, get, child, update } from 'firebase/database';

export const FETCH_RESTAURANTS = 'FETCH_RESTAURANTS';
export const SET_VISIT_STATUS = 'SET_VISIT_STATUS';

const GOOGLE_PLACES_API_KEY = 'AIzaSyBO-Z2JZ7S0rbJbnQw1PVmBmdJq8Z_XM5o';

// Hae ravintolat Google Places API:sta
export const fetchRestaurants = (searchTerm) => {
  return async (dispatch) => {
    try {
      // Hae ravintolat Google Places API:sta
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${searchTerm}&type=restaurant&key=${GOOGLE_PLACES_API_KEY}`
      );
      const restaurants = response.data.results.map((place) => ({
        id: place.place_id,
        name: place.name,
        location: place.formatted_address,
        rating: place.rating,
        visited: false,
        toVisit: false,
      }));

      // Päivitetään Redux-tila suoraan haetuilla ravintoloilla
      dispatch({
        type: FETCH_RESTAURANTS,
        payload: restaurants,
      });

      // Tallenna ravintolat Firebaseen, jos ne eivät vielä ole siellä
      const restaurantRef = ref(db, 'restaurants');
      const dbSnapshot = await get(restaurantRef);

      restaurants.forEach((restaurant) => {
        if (!dbSnapshot.hasChild(restaurant.id)) {
          // Lisää ravintola Firebaseen vain, jos se ei ole jo olemassa
          const newRestaurantRef = child(restaurantRef, restaurant.id);
          set(newRestaurantRef, restaurant);
        }
      });
    } catch (error) {
      console.error('Error fetching restaurants:', error);
    }
  };
};

// Päivitä ravintolan tila Firebase-tietokannassa
export const setVisitStatus = (id, status) => {
  return async (dispatch) => {
    try {
      const restaurantRef = ref(db, `restaurants/${id}`);
      
      // Päivitä kenttä sen mukaan, mikä status on asetettu
      let updateData = {};
      if (status === 'visited') {
        updateData = {
          visited: true,
          toVisit: false,
        };
      } else if (status === 'toVisit') {
        updateData = {
          visited: false,
          toVisit: true,
        };
      } else if (status === 'remove') {
        updateData = {
          visited: false,
          toVisit: false,
        };
      }

      console.log('Päivitetään ravintolan tila datalla:', updateData);
      await update(restaurantRef, updateData);
      console.log('Ravintolan tila päivitettiin onnistuneesti');

      // Lähetä Redux-tilan päivitys
      dispatch({
        type: SET_VISIT_STATUS,
        payload: {
          id,
          status: updateData,
        },
      });

    } catch (error) {
      console.error('Virhe ravintolan tilan asettamisessa:', error);
    }
  };
};