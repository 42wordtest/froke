import {  StyleSheet, View ,Text} from 'react-native';
import { AddLocationButton } from '../Locations';
import MapView, { Callout, Marker } from 'react-native-maps';
import { useEffect, useState } from 'react';
import { getLocations } from '../../api';



export default function MapTab({navigation}) {

  const [locationData, setLocationData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
getLocations()
.then(({locations})=>{
  setLocationData(locations)
  setLoading(false)
})
  },[])

  if (loading) {

    
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    )
  }


  function handleMarkerPress (locationId) {
    navigation.navigate('Single Location', locationId);
  }
  return (

        <View style={styles.container}>
        <MapView 
        style={styles.map} 
        initialRegion={{
            latitude: 54.7023545,
            longitude: -4.2765753,
            latitudeDelta: 13,
            longitudeDelta: 13,
        }}
        showsUserLocation={true}>
   
  {locationData.map((location)=>{


         const string = JSON.stringify(location)
         const parsed = JSON.parse(string)

           return  <Marker coordinate={{latitude: parsed.coordinates[1], longitude: parsed.coordinates[0]}}  >
          
            <Callout onPress={(e) => handleMarkerPress(parsed.location_id)}>
            <Text style={{fontWeight: "bold"}}>
               {parsed.location_name}
            </Text>
          <Text style={styles.startext}>
            {parsed.avg_rating!== null ? `Rating: ${parsed.avg_rating }/5` : 'No Ratings yet'}
          </Text>
          <Text>
            Click for more info!
          </Text>
            </Callout>
            </Marker>
          })}
      
      </MapView>
 
        <AddLocationButton navigation={navigation}/>
      </View>
    
  
    )



}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      position: 'relative',
    },
    map: {
      width: '100%',
      height: '100%',
    },
    startext: {
      color: '#489fe1',
      fontWeight: 'bold',
      fontSize: 13,
    },
  });
  