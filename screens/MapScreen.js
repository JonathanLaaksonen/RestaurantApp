import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert, TextInput, Button, Keyboard, TouchableWithoutFeedback, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

export default function MapScreen() {
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState('');
  const [errorMsg, setErrorMsg] = useState(null);

  // Funktio, joka pyytää sijaintiluvat ja hakee nykyisen sijainnin
  const getCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setErrorMsg('Permission to access location was denied');
      return;
    }

    let currentLocation = await Location.getCurrentPositionAsync({});
    setLocation(currentLocation.coords);
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCoordinates = async () => {
    try {
      const response = await fetch(`https://geocode.maps.co/search?q=${encodeURIComponent(address)}`);
      const data = await response.json();

      if (data.length > 0) {
        const { lat, lon } = data[0];
        setLocation({
          latitude: parseFloat(lat),
          longitude: parseFloat(lon),
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
        Keyboard.dismiss();
      } else {
        Alert.alert('Address not found');
      }
    } catch (error) {
      console.error('Error fetching coordinates:', error);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Enter address"
          value={address}
          onChangeText={setAddress}
        />
        <Button title="Search" onPress={getCoordinates} />

        {location ? (
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            region={location}
          >
            <Marker
              coordinate={{
                latitude: location.latitude,
                longitude: location.longitude,
              }}
              title="You are here"
            />
            {/* Lisää tähän ravintoloiden markerit */}
          </MapView>
        ) : (
          <View style={styles.loading}>
            <Text>Loading...</Text>
          </View>
        )}
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
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: 'white',
    zIndex: 1,
  },
});
