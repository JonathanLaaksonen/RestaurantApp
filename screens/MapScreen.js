import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Alert, TextInput, Button, Keyboard, TouchableWithoutFeedback, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import axios from 'axios';

// API-avain tulisi tallentaa turvallisesti esimerkiksi ympäristömuuttujiin.
// Tämä on esimerkki siitä, että muuttuja on turvallisesti käytössä tässä tiedostossa.
const GOOGLE_PLACES_API_KEY = 'AIzaSyBO-Z2JZ7S0rbJbnQw1PVmBmdJq8Z_XM5o';

export default function MapScreen() {
  const [location, setLocation] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [address, setAddress] = useState('');
  const [errorMsg, setErrorMsg] = useState(null);
  const mapRef = useRef(null); // Ref to MapView

  // Funktio, joka pyytää sijaintiluvat ja hakee nykyisen sijainnin
  const getCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setErrorMsg('Permission to access location was denied');
      return;
    }

    let currentLocation = await Location.getCurrentPositionAsync({});
    setCurrentLocation({
      latitude: currentLocation.coords.latitude,
      longitude: currentLocation.coords.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });
    setLocation(currentLocation.coords); // Asetetaan myös aluksi kartan katsottava sijainti nykyiseksi sijainniksi
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCoordinates = async () => {
    try {
      // Hae osoitteen koordinaatit Google Geocoding API:lla
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_PLACES_API_KEY}`
      );

      if (response.data.status === 'OK' && response.data.results.length > 0) {
        const { lat, lng } = response.data.results[0].geometry.location;
        const newLocation = {
          latitude: parseFloat(lat),
          longitude: parseFloat(lng),
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };

        setLocation(newLocation);
        // Animoi kartta uuteen sijaintiin
        if (mapRef.current) {
          mapRef.current.animateToRegion(newLocation, 1000);
        }

        Keyboard.dismiss();
      } else {
        Alert.alert('Address not found');
      }
    } catch (error) {
      console.error('Error fetching coordinates:', error);
      Alert.alert('Failed to fetch coordinates', 'Please try again.');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <MapView
          ref={mapRef} // Attach the ref to MapView
          style={styles.map}
          initialRegion={{
            latitude: currentLocation ? currentLocation.latitude : 60.192059,
            longitude: currentLocation ? currentLocation.longitude : 24.945831,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          region={location || currentLocation} // Kartan alue perustuu joko haettuun sijaintiin tai nykyiseen sijaintiin
        >
          {/* Nykyisen sijainnin markkeri */}
          {currentLocation && (
            <Marker
              coordinate={{
                latitude: currentLocation.latitude,
                longitude: currentLocation.longitude,
              }}
              title="Current Location"
              pinColor="blue"
            />
          )}
          {/* Haetun osoitteen markkeri, jos sellainen on */}
          {location && (
            <Marker
              coordinate={{
                latitude: location.latitude,
                longitude: location.longitude,
              }}
              title="Searched Location"
            />
          )}
        </MapView>

        {/* Osoitteen haku ja painike */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter address"
            value={address}
            onChangeText={setAddress}
          />
          <Button title="Search" onPress={getCoordinates} />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  searchContainer: {
    position: 'absolute',
    top: 20,
    left: 10,
    right: 10,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: 'white',
  },
});
