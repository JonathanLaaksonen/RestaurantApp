import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { fetchRestaurants, setVisitStatus } from '../redux/actions';
import { getAuth, signOut } from 'firebase/auth';

// Kuvan tuominen paikallisesta kansiosta
const searchIcon = require('../assets/search.png');

const HomeScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('Restaurants');
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const dispatch = useDispatch();
  const restaurants = useSelector((state) => state.restaurants.list || []);

  useEffect(() => {
    dispatch(fetchRestaurants('restaurant'));
  }, [dispatch]);

  const handleSearch = async () => {
    await dispatch(fetchRestaurants(searchQuery));
  };

  // Filter the restaurants based on the filter status
  const filteredRestaurants = restaurants.filter((restaurant) => {
    if (filterStatus === 'Restaurants') {
      return !restaurant.visited && !restaurant.toVisit;
    }
    if (filterStatus === 'To Visit') {
      return restaurant.toVisit;
    }
    if (filterStatus === 'Visited') {
      return restaurant.visited;
    }
    return true;
  });

  const handleSetVisitStatus = (id, status) => {
    dispatch(setVisitStatus(id, status));
    setSelectedRestaurant(null);
  };

  const handleRestaurantPress = (restaurant) => {
    setSelectedRestaurant(
      selectedRestaurant && selectedRestaurant.id === restaurant.id ? null : restaurant
    );
  };

  const handleLogout = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
      })
      .catch((error) => {
        console.error('Error logging out:', error);
      });
  };

  return (
    <View style={styles.container}>
      {/* Wrapper for Search Input and Search Icon */}
      <View style={styles.searchContainer}>
        <Image source={searchIcon} style={styles.searchIcon} />
        <TextInput
          style={styles.searchBar}
          placeholder="Search Restaurants"
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)}
        />
      </View>
      <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
        <Text style={styles.searchButtonText}>Search</Text>
      </TouchableOpacity>

      <View style={styles.filterContainer}>
        <TouchableOpacity onPress={() => setFilterStatus('Restaurants')} style={styles.filterButton}>
          <Text style={filterStatus === 'Restaurants' ? styles.filterActive : styles.filterText}>Restaurants</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setFilterStatus('To Visit')} style={styles.filterButton}>
          <Text style={filterStatus === 'To Visit' ? styles.filterActive : styles.filterText}>To Visit</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setFilterStatus('Visited')} style={styles.filterButton}>
          <Text style={filterStatus === 'Visited' ? styles.filterActive : styles.filterText}>Visited</Text>
        </TouchableOpacity>
      </View>

      {/* Wrapper for FlatList to limit its height */}
      <View style={styles.listContainer}>
      <FlatList
  data={filteredRestaurants}
  keyExtractor={(item) => item.id}
  renderItem={({ item }) => (
    <View style={styles.restaurantItem}>
      <TouchableOpacity onPress={() => handleRestaurantPress(item)}>
        <Text style={styles.restaurantName}>{item.name}</Text>
        <Text>{item.location}</Text>
        {/* Lisää arvostelutiedot */}
        {item.rating && (
          <Text style={styles.ratingText}>Rating: {item.rating} / 5</Text>
        )}
      </TouchableOpacity>
      {selectedRestaurant && selectedRestaurant.id === item.id && (
        <View>
          {!item.visited && !item.toVisit && (
            <>
              <TouchableOpacity onPress={() => handleSetVisitStatus(item.id, 'toVisit')}>
                <Text style={styles.visitButton}>Mark as Visit</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleSetVisitStatus(item.id, 'visited')}>
                <Text style={styles.visitButton}>Mark as Visited</Text>
              </TouchableOpacity>
            </>
          )}
          {item.toVisit && (
            <>
              <TouchableOpacity onPress={() => handleSetVisitStatus(item.id, 'visited')}>
                <Text style={styles.visitButton}>Move to Visited</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleSetVisitStatus(item.id, 'remove')}>
                <Text style={styles.visitButton}>Remove from Visit</Text>
              </TouchableOpacity>
            </>
          )}
          {item.visited && (
            <>
              <TouchableOpacity onPress={() => handleSetVisitStatus(item.id, 'remove')}>
                <Text style={styles.visitButton}>Remove from Visited</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      )}
    </View>
  )}
/>
      </View>

      {/* Logout Button with TouchableOpacity */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F0F8FF',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  searchIcon: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  searchBar: {
    flex: 1,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  searchButton: {
    backgroundColor: '#54C5E6', // sinertävä väri
    paddingVertical: 8,
    paddingHorizontal: 32,
    borderRadius: 28,
    marginBottom: 16,
    alignItems: 'center',
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  filterButton: {
    padding: 8,
  },
  filterText: {
    color: 'black',
  },
  filterActive: {
    color: 'blue',
    fontWeight: 'bold',
  },
  ratingText: {
    color: '#666', // Harmaa väri
    fontSize: 14,
    marginTop: 4,
  },  
  listContainer: {
    flex: 1, // Joustava tila, jotta FlatList ei vie liikaa tilaa
    marginBottom: 20, // Jätä tilaa Logout-painikkeelle
  },
  restaurantItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  visitButton: {
    marginTop: 8,
    color: '#F16842',
  },
  logoutButton: {
    backgroundColor: '#F16842', // punertava väri
    paddingVertical: 8,
    paddingHorizontal: 32,
    borderRadius: 28,
    alignItems: 'center',
    marginBottom: 20,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default HomeScreen;