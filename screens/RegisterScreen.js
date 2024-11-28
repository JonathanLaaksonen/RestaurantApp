import React, { useState } from 'react';
import { View, Text, Button, TextInput, Alert, StyleSheet } from 'react-native';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { app } from '../firebase/FirebaseConfig'; // Importoidaan app-instanssi

const auth = getAuth(app); // Käytetään app-instanssia

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
      <Text style={styles.title}>Register Screen</Text>
      <TextInput
        placeholder="Email"
        style={styles.input}
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        style={styles.input}
        value={password}
        onChangeText={(text) => setPassword(text)}
      />
      <Button title="Register" onPress={handleRegister} />
      <Button
        title="Already have an account? Login"
        onPress={() => navigation.navigate('Login')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
  },
  input: {
    borderBottomWidth: 1,
    width: 200,
    marginVertical: 10,
    padding: 8,
  },
});
