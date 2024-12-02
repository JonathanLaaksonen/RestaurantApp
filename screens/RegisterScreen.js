import React, { useState } from 'react';
import { View, Text, Alert, TextInput, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { app } from '../firebase/FirebaseConfig'; // Importoidaan app-instanssi

// Kuvan tuominen paikallisesta kansiosta
const auth = getAuth(app);
const logo = require('../assets/registerkuv.png'); // Tässä tuodaan uusi kuva registerkuv.png tiedosto assets-kansiosta

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Onnistunut rekisteröinti
        Alert.alert('Registration Successful', 'You can now log in with your credentials.');
        navigation.navigate('Login'); // Vie käyttäjä takaisin kirjautumissivulle
      })
      .catch((error) => {
        const errorMessage = error.message;
        Alert.alert('Registration Failed', errorMessage);
      });
  };

  return (
    <View style={styles.container}>
      {/* Lisää uusi kuva */}
      <Image source={logo} style={styles.logo} />

      <Text style={styles.title}>Register Page</Text>
      <Text style={styles.subtitle}>Just register here and then start find your restaurant!</Text>

      <TextInput
        placeholder="Email"
        style={styles.input} // Käytetään samaa tyyliä kuin Search Restaurants kentässä
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        style={styles.input} // Käytetään samaa tyyliä kuin Search Restaurants kentässä
        value={password}
        onChangeText={(text) => setPassword(text)}
      />

      {/* Register-painike käyttäen TouchableOpacity */}
      <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
        <Text style={styles.registerButtonText}>Register</Text>
      </TouchableOpacity>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start', // Nosta kaikki ylös
    padding: 16,
    paddingTop: 10, // Lisää ylimääräinen yläreunan täyte (nostaa koko sisältöä ylemmäs)
    backgroundColor: '#F0F8FF', // Light blue background color
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#00008B', // Dark blue color
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00008B', // Dark blue color
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 8,
    borderRadius: 8,
    width: 250, // Lisää tarvittaessa leveys, jotta se näyttää hyvältä
  },
  registerButton: {
    backgroundColor: '#F16842', // Oranssi väri
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginTop: 16,
    alignItems: 'center',
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
