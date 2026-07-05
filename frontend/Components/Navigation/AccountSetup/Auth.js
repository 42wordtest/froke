import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../../../localDatabase/firebase';

const AuthDetails = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || '',
        });
      } else {
        setUser(null);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const userSignOut = () => {
    signOut(auth)
      .then(() => {
        console.log('Sign Out Successful');
      })
      .catch((error) => {
        console.error('Sign Out Error', error);
      });
  };

  return (
    <View>
      {user ? (
        <>
        <TouchableOpacity style={styles.button} onPress={userSignOut}>
        <Text style={styles.buttonText}>Sign Out</Text>
      </TouchableOpacity>
        </>
      ) : (
        <Text>Signed Out</Text>
      )}
    </View>
  );
};

export default AuthDetails;


const styles = StyleSheet.create({
  // container: {
  //   marginTop: 1, 
  //   alignItems: 'center',
  //   width: '100%', 
  // },
  button: {
    backgroundColor: '#007bff', 
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%', 
    marginBottom:20
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  }
});