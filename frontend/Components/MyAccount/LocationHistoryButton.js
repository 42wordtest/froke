import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function LocationHistoryButton({ navigation, user }) {
  const handlePress = () => {
    navigation.navigate('Location History');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={handlePress}>
        <Text style={styles.buttonText}>Location History</Text>
      </TouchableOpacity>
    </View>
  );
}

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
    width: 150, 
    marginBottom:20
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  }
});