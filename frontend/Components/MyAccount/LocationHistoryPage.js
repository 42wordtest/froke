import { StyleSheet, Text, View } from 'react-native';

export default function LocationHistoryPage() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Location history is not tracked yet.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#D0e5ec',
    padding: 20,
  },
  text: {
    color: '#00235A',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
