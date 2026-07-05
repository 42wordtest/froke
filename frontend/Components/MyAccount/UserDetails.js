import React from 'react';
import { StyleSheet, Text, View, TextInput, Button, Image, TouchableHighlight, TouchableOpacity } from 'react-native';
import { useUser } from '../Navigation/AccountSetup/UserContext';
import defaultAvatar from '../MyAccount/User.png'

export default function UserDetails() {
  const user = useUser();

  if (!user) {
    return (
      <View style={style.container}>
        <Text>Loading user data...</Text>
      </View>
    );
  }

  return (
    <View style={style.container}>
      <Image 
        source={user.photoURL ? { uri: user.photoURL } : defaultAvatar} 
        style={style.avatar} 
      />
      <Text style={style.username}>{user.displayName || 'Username not set'}</Text>
      <Text style={style.detail}>Email: {user.email}</Text>
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D0e5ec',
    padding: 0,
    margin: 0,
    height: 40,
  },
  avatar: {
    width: 120, 
    height: 120,
    borderRadius: 20, 
    marginBottom: 20,
    paddingBottom: 0,
    borderWidth: 3, 
    borderColor: '#70bfec',
  },
  username: {
    fontSize: 26, 
    fontWeight: 'bold',
    color: '#007bff', 
  },
  detail: {
    fontSize: 18,
    color: '#555555',
    fontWeight: 'bold',
    color: '#00235A', 
  },
  loadingText: {
    fontSize: 18,
    color: '#555555',
  }
});