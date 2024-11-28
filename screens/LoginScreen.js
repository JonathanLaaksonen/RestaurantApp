import React, { useState } from 'react';
import { View, Text, Button, TextInput, Alert } from 'react-native';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { app } from '../firebase/FirebaseConfig';

const auth = getAuth(app);

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Successful login, navigate to HomeScreen
        navigation.navigate('Home');
      })
      .catch((error) => {
        Alert.alert('Login Error', error.message);
      });
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Login Screen</Text>
      <TextInput 
        placeholder="Email"
        style={{ borderBottomWidth: 1, width: 200, marginVertical: 10 }}
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      <TextInput 
        placeholder="Password" 
        secureTextEntry 
        style={{ borderBottomWidth: 1, width: 200, marginVertical: 10 }}
        value={password}
        onChangeText={(text) => setPassword(text)}
      />
      <Button title="Login" onPress={handleLogin} />
      <Button title="Don't have an account? Register here" onPress={() => navigation.navigate('Register')} />
    </View>
  );
}
