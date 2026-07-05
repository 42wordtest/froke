import { StyleSheet, Text, View , TouchableOpacity} from 'react-native';
import {AddLocationHome, TopLocations , NearbyLocations }from '../Locations/index';
import SwimmingAdvice from '../index';
import { useUser } from '../Navigation/AccountSetup/UserContext';
import { ScrollView } from 'react-native-gesture-handler';




export default function HomeTab({navigation, route}) {

 const user = useUser();
  const {topRatedLocations, closestLocations} = route.params
  function handlePress () {
    navigation.navigate('All Locations')
  }
  
    return (
      <ScrollView contentContainerStyle={styles.scrollViewContainer} >
        <View style={styles.header}>
        <Text style={styles.headerText}>Nearby Locations</Text>
      </View>
        <NearbyLocations navigation={navigation} closestLocations={closestLocations}/>
        <View style={styles.header}>
        <Text style={styles.headerText}>Top Rated Locations</Text>
        </View>
        <TopLocations  navigation={navigation}  topRatedLocations={topRatedLocations}/>
       <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.AllLocationButton} onPress={handlePress}>
  <Text style={styles.AllLocationText}>
  All Locations
  </Text>
</TouchableOpacity>

        <SwimmingAdvice />
        </View>
        <AddLocationHome navigation={navigation}/>
      </ScrollView>
    );
  }



 const styles = StyleSheet.create({
  scrollViewContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  marginBottom: 190,

  },
  header: {
    backgroundColor: '#D6DBFE',
    padding:10,
    width: "100%",
    alignItems: "center",
  
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: "black"
 },
 buttonContainer: {
  display: 'flex',
  flexDirection: 'row',
  justifyContent: "space-between"
},
AllLocationButton:{
  backgroundColor: "#4578DE",
  padding: 17,
  borderRadius:10,
  elevation: 50,
  marginRight:15,

},
AllLocationText: {
  color: "white",
  fontWeight: "bold",
  alignItems: "center",
  fontSize: 15
  
    },
})