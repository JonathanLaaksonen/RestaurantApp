import React, { useState } from 'react';
import { View, Text, Alert, TextInput, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { app } from '../firebase/FirebaseConfig';

// Kuvan tuominen paikallisesta kansiosta
const auth = getAuth(app);
const logo = require('../assets/map.png'); // Korvaa favicon.png tiedostolla map.png

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Successful login, navigate to HomeScreen
        navigation.navigate('Main');
      })
      .catch((error) => {
        Alert.alert('Login Error', error.message);
      });
  };

  return (
    <View style={styles.container}>
      {/* Lisää uusi kuva */}
      <Image source={logo} style={styles.logo} />

      <Text style={styles.title}>Welcome to the Restaurant Finder</Text>
      <Text style={styles.subtitle}>Login here and start searching!</Text>

      <TextInput 
        placeholder="Email"
        style={styles.searchBar} // Käytetään samaa tyyliä kuin Search Restaurants kentässä
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      <TextInput 
        placeholder="Password" 
        secureTextEntry 
        style={styles.searchBar} // Käytetään samaa tyyliä kuin Search Restaurants kentässä
        value={password}
        onChangeText={(text) => setPassword(text)}
      />
      
      {/* Login-painike käyttäen TouchableOpacity */}
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>

      <View style={styles.registerButtonContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.registerButtonText}>Don't have an account? Register here</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start', // Nosta kaikki ylös
    padding: 16,
    paddingTop: 60, // Lisää ylimääräinen yläreunan täyte (nostaa koko sisältöä ylemmäs)
    backgroundColor: '#F0F8FF', // Light blue background color
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 30,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#00008B', // Dark blue color
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00008B', // Dark blue color
    marginBottom: 18,
  },
  searchBar: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 12,
    borderRadius: 8,
    width: 250, // Lisää tarvittaessa leveys, jotta se näyttää hyvältä
  },
  loginButton: {
    backgroundColor: '#F16842', // Punertava väri
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginTop: 16,
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  registerButtonContainer: {
    marginTop: 20,
  },
  registerButtonText: {
    color: '#54C5E6', // Sininen väri
    textDecorationLine: 'underline',
    fontSize: 15,
  },
});
