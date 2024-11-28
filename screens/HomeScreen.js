import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Button } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { fetchRestaurants, setVisitStatus, addRestaurant } from '../redux/actions';

const HomeScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('Restaurants');
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const dispatch = useDispatch();
  const restaurants = useSelector((state) => state.restaurants.list);

  useEffect(() => {
    // Fetch restaurant data when the component mounts with an initial search term
    dispatch(fetchRestaurants('restaurant'));
  }, [dispatch]);

  const handleSearch = async () => {
    // Fetch restaurants based on the search query
    await dispatch(fetchRestaurants(searchQuery));
  };

  // Filter the restaurants based on the filter status
  const filteredRestaurants = restaurants.filter((restaurant) => {
    if (filterStatus === 'Restaurants') {
      return !restaurant.visited && !restaurant.toVisit; // Show all restaurants initially that are not marked
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
    setSelectedRestaurant(null); // Deselect restaurant after status change
  };
  

  const handleRestaurantPress = (restaurant) => {
    setSelectedRestaurant(
      selectedRestaurant && selectedRestaurant.id === restaurant.id ? null : restaurant
    );
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search Restaurants"
        value={searchQuery}
        onChangeText={(text) => setSearchQuery(text)}
      />
      <Button title="Search" onPress={handleSearch} />

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

      <FlatList
        data={filteredRestaurants}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.restaurantItem}>
            <TouchableOpacity onPress={() => handleRestaurantPress(item)}>
              <Text style={styles.restaurantName}>{item.name}</Text>
              <Text>{item.location}</Text>
            </TouchableOpacity>
            {selectedRestaurant && selectedRestaurant.id === item.id && (
              <View>
                {!item.visited && !item.toVisit && (
                  <>
                    <TouchableOpacity onPress={() => handleSetVisitStatus(item.id, 'toVisit')}>
                      <Text style={styles.visitButton}>Mark as To Visit</Text>
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
                      <Text style={styles.visitButton}>Remove from To Visit</Text>
                    </TouchableOpacity>
                  </>
                )}
                {item.visited && (
                  <>
                    <TouchableOpacity onPress={() => handleSetVisitStatus(item.id, 'toVisit')}>
                      <Text style={styles.visitButton}>Move to To Visit</Text>
                    </TouchableOpacity>
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  searchBar: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 8,
    borderRadius: 8,
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
    color: '#666',
  },
  filterActive: {
    color: 'tomato',
    fontWeight: 'bold',
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
    color: 'dodgerblue',
  },
});

export default HomeScreen;
