import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { fetchRestaurants, setVisitStatus } from '../redux/actions';

const HomeScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const dispatch = useDispatch();
  const restaurants = useSelector((state) => state.restaurants.list);

  useEffect(() => {
    // Fetch restaurant data when the component mounts with an initial search term
    dispatch(fetchRestaurants('restaurant'));
  }, [dispatch]);

  const handleSearch = () => {
    // Fetch restaurants based on the search query
    dispatch(fetchRestaurants(searchQuery));
  };

  const filteredRestaurants = restaurants.filter((restaurant) => {
    const matchesFilter =
      filterStatus === 'All' ||
      (filterStatus === 'To Visit' && !restaurant.visited) ||
      (filterStatus === 'Visited' && restaurant.visited);

    return matchesFilter;
  });

  const handleSetVisitStatus = (id) => {
    dispatch(setVisitStatus(id));
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search Restaurants"
        value={searchQuery}
        onChangeText={(text) => setSearchQuery(text)}
        onSubmitEditing={handleSearch}
      />

      <View style={styles.filterContainer}>
        <TouchableOpacity onPress={() => setFilterStatus('All')} style={styles.filterButton}>
          <Text style={filterStatus === 'All' ? styles.filterActive : styles.filterText}>All</Text>
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
            <Text style={styles.restaurantName}>{item.name}</Text>
            <Text>{item.location}</Text>
            <TouchableOpacity onPress={() => handleSetVisitStatus(item.id)}>
              <Text style={styles.visitButton}>{item.visited ? 'Mark as To Visit' : 'Mark as Visited'}</Text>
            </TouchableOpacity>
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
    marginBottom: 16,
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