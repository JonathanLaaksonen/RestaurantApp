import React from 'react';
import { View, Text, Button, TextInput } from 'react-native';

export default function LoginScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Login Screen</Text>
      <TextInput placeholder="Email" style={{ borderBottomWidth: 1, width: 200, marginVertical: 10 }} />
      <TextInput placeholder="Password" secureTextEntry style={{ borderBottomWidth: 1, width: 200, marginVertical: 10 }} />
      <Button title="Login" onPress={() => navigation.navigate('Main')} />
    </View>
  );
}
