import { StyleSheet, Text, View } from 'react-native';
import LocationCard from './LocationCard';
import { useEffect, useState } from 'react';
import { getLocations } from '../../api';
import { ScrollView } from 'react-native-gesture-handler';
import { getDistance } from 'geolib'


export default function TopLocations({navigation, topRatedLocations}) {
    return (
      <ScrollView horizontal={true} style={{ flexDirection: 'row', margin: 10}}>
        {topRatedLocations.map((location)=> {
          return <LocationCard
          navigation={navigation}
          distance={location.distance}
          location_area={location.location_area}
          key={location._id}
          location_img_url={location.location_img_url}
          location_id={location.location_id}
          location_name={location.location_name}
          avg_rating={location.avg_rating}
          />
        })}
      </ScrollView>
    );
  }

 