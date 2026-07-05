import React, { useState } from 'react';
import { StyleSheet, Text, Image, View, TouchableOpacity, Linking } from 'react-native';
import { StarRating } from './StarRating';
import Icon from 'react-native-ico-material-design';
import {saveLocation, unsaveLocation, findID} from '../../localDatabase/database.js'

export default function SingleLocationContainer({ location, reviewCount, averageRating, saved }) {
  const [savedClicked, setSavedClicked] = useState((saved ? true : false))
  const [visitedClicked, setVisitedClicked] = useState(false)
  const [saving, setSaving] = useState(false)

  const waterDate = new Date(location.water_classification_date);

  const formattedWaterDate = waterDate.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  const handleSave = () => {
    if(saving === false){
      setSaving(true)
      if(savedClicked === false){
        saveLocation(location).then(()=>{
          setSavedClicked(true)
          setSaving(false)
        }).catch((err)=>console.log(err))
      }
      else {
        unsaveLocation(location.location_id).then(()=>{
          setSavedClicked(false)
          setSaving(false)
        })
      }
    }
  }

  const handleDirections = () => {
    const directionsLink = `https://www.google.com/maps/dir/?api=1&destination=${location.coordinates[1]},${location.coordinates[0]}`;
  
    Linking.openURL(directionsLink)
      .catch((error) => {
        console.error(`Error opening directions link: ${error}`);
      });
  };
  
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <View style={styles.header}>
        <Text style={styles.headerText}>{location.location_name}</Text>
      </View>
      <View style={styles.ratingContainer}>
        <View style={styles.starRating}>
          <StarRating
            rating={averageRating !== null ? averageRating : 0}
          />
          <Text style={styles.startext}>
            {averageRating !== null ? averageRating : 'No Ratings yet'}
          </Text>
        </View>
        <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
          {savedClicked ? <Icon name='bookmark-ribbon' color='#4578DE'/> : <Icon name='bookmark-outline' color='#4578DE'/>}
        </TouchableOpacity>
      </View>

      <Image source={{ uri: location.location_img_url }} style={{ width: 350, height: 250 }} />
      <View style={styles.directionsShare}>
        <TouchableOpacity style={styles.navigationButton} onPress={handleDirections}>
          <Icon name='compass-with-white-needles' color='#4578DE' height="30" width="30"/>
        </TouchableOpacity>
      </View>

      <View style={styles.mainBody}>
        <View style={styles.infoContainer}>
          <Text style={styles.header2}>Swim Spot Information</Text>
          <Text style={styles.text}>{location.body}</Text>
        </View>

        {location.water_classification !== null && (
          <View style={styles.waterQualityContainer}>
            <Text style={styles.header2}>Water Quality</Text>
            <Text style={styles.text}>{`Water Quality Classification: ${location.water_classification}`}</Text>
            <Text style={styles.text}>{`Date of testing: ${formattedWaterDate}`}</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    position: 'absolute',
    top: 25,
    left: -32,
    fontWeight: 'bold',
    fontSize: 20,
    backgroundColor: '#D6DBFE',
    width: '100%',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 2
  },
  header2: {
    fontWeight: 'bold',
    marginTop: 10,
    color: 'black',
    fontSize: 16
  },
  directionsShare: {
    position: 'absolute',
    top: 135,
    left: 14
  },
  navigationButton: {
    backgroundColor: 'white',
    padding: 7,
    borderRadius: 8
  },
  mainBody: {
    backgroundColor: 'white',
    width: 350,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#D6DBFE',
    paddingBottom: 5,
    marginTop: 20
  },
  infoContainer: {
    alignSelf: 'flex-start',
    marginHorizontal: 15
  },
  waterQualityContainer: {
    marginTop: 10,
    alignSelf: 'flex-start',
    marginHorizontal: 15,
    marginBottom: 10
  },
  ratingContainer: {
    marginTop: 90,
    flexDirection: 'row',
    justifyContent: 'space-between', 
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginLeft: 0,
    marginBottom: 5,
    width: 350
  },
  starRating: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  startext: {
    color: '#4578DE',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 4,
  },
});
