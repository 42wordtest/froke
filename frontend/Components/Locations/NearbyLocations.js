import { StyleSheet, Text, View } from 'react-native';
import LocationCard from './LocationCard';
import { useEffect, useState } from 'react';
import { getDistance } from 'geolib'
import { getLocations } from '../../api';
import { ScrollView } from 'react-native-gesture-handler';

export default function NearbyLocations({navigation , closestLocations}) {


return (
<ScrollView horizontal={true} style={{ flexDirection: 'row', margin: 10}}>
{closestLocations.map((location) => {
   return <LocationCard
    key={location._id}
    navigation={navigation}
    location_area={location.location_area}
    location_id={location.location_id}
    location_name={location.location_name}
    location_img_url={location.location_img_url}
    distance={location.distance}
  />
})}
</ScrollView>
);
}





