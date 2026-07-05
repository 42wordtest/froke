import { StyleSheet, Text, TouchableOpacity, View, Image, Linking} from 'react-native';
import SingleLocation from './SingleLocation';
import Icon from 'react-native-ico-material-design'

export default function SavedLocationCard({navigation, location}) {
  
  const handlePress = () => {
    navigation.navigate('Single Location', location.location_id);}
  const handleDirections = () => {
      const directionsLink = `https://www.google.com/maps/dir/?api=1&destination=${location.longitude},${location.latitude}`;
      Linking.openURL(directionsLink)
        .catch((error) => {
          console.error(`Error opening directions link: ${error}`);
        });
    };
    return (
      
        <TouchableOpacity onPress={handlePress}> 
        <View style={styles.savedBox}>
          <Image style={styles.smallPic} source={{uri:location.imgURL}}></Image>
            <View style={styles.textContainer}>
              <Text style={styles.textMain}>{location.location_name}</Text>
              <Text style={styles.textSub}>{location.location_area}</Text>
            </View>
          <TouchableOpacity style={styles.navigationButton} onPress={handleDirections}>
            <Icon name='compass-with-white-needles' color='#4578DE' height="30" width="30"/>
          </TouchableOpacity>
        </View>
        </TouchableOpacity>
      
    );
  }


const styles = StyleSheet.create({
    savedBox:{ 
      backgroundColor: "#7393B3",
      borderWidth: 1,
      borderColor: 'white',
      margin:10,
      alignItems: 'flex-start',
      flexDirection: 'row',
      flex:1,
      borderRadius:5,
       },
    textMain:{
      fontSize:20,
      color:"white", 
      textAlign: 'left'},
    textContainer:{flex:1},  
    textSub:{
      fontStyle:'italic',
      color:"white", 
      textAlign: 'left'},
    smallPic:{
      alignSelf:'flex-start',
      height:100,
      width:100,
      marginRight:10,
      borderTopLeftRadius:5,
      borderBottomLeftRadius:5
    },
    navigationButton: {
      backgroundColor: 'white',
      padding: 5,
      borderTopRightRadius: 5,
      borderBottomLeftRadius: 5,
    },
  });
  