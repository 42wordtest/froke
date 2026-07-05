import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import UserDetails from '../MyAccount/UserDetails';
import AchievementButton from '../MyAccount/AchievementButton';
import LocationHistoryButton from '../MyAccount/LocationHistoryButton';
import AuthDetails from './AccountSetup/Auth';
import { useUser } from './AccountSetup/UserContext';

export default function MyAccountTab({navigation}) {
  const user = useUser();

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}> Welcome </Text>
      <UserDetails />
      <AchievementButton navigation={navigation} user={user}/>
      <LocationHistoryButton navigation={navigation}/>
      <AuthDetails/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 10,
    backgroundColor: '#D0e5ec', 
    height: 100
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#00235A', 
  }
});