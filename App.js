import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, ActivityIndicator } from 'react-native';
import { Provider } from 'react-redux';
import store from './redux/store';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import MapScreen from './screens/MapScreen';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: { height: 60, paddingBottom: 10, backgroundColor: 'black' },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 24, color }}>🏠</Text>
          ),
          headerStyle: {
            backgroundColor: '#54C5E6',
          },
          headerTintColor: '#fff',
        }}
      />
      <Tab.Screen
        name="Map"
        component={MapScreen}
        options={{
          tabBarLabel: 'Map',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 24, color }}>🗺️</Text>
          ),
          headerStyle: {
            backgroundColor: '#54C5E6',
          },
          headerTintColor: '#fff',
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    });
    return unsubscribe;
  }, [auth]);

  if (isAuthenticated === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <Provider store={store}>
      <NavigationContainer>
      <Stack.Navigator>
  {isAuthenticated ? (
    <Stack.Screen
      name="Main"
      component={TabNavigator}
      options={{
        headerShown: false,
      }}
    />
  ) : (
    <>
      <Stack.Screen
  name="Login"
  component={LoginScreen}
  options={{
    headerStyle: {
      backgroundColor: '#54C5E6', // Käytetään sinistä väriä kuvasta
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
  }}
/>

      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{
          headerStyle: {
            backgroundColor: '#54C5E6',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
    </>
  )}
</Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
