import { StyleSheet, View, Pressable,Text } from 'react-native';
import Icon from 'react-native-ico-material-design';
import { useUser } from '../Navigation/AccountSetup/UserContext';

export default function AddLocationButtonHome({navigation}) {
  const user = useUser();
  const handlePress = () => {
    if (user) {
      navigation.navigate('Add Location Map');
    } else {
      navigation.navigate("Log in");
    }
  };
    return (
      <View style={styles.addLocationContainer} >
           <Pressable 
            onPress={handlePress} 
            style={styles.Pressable}
            >
             <Icon name="add-plus-button" height="40" width="40" style={styles.icon} color='white'/>
          </Pressable>  
          <Text  style={styles.text}>Add a new location</Text>
      </View>
    );
  }

  const styles = StyleSheet.create({
    Pressable: {
      borderColor: '#a6a6a6',
      borderWidth: 2,
      borderRadius: 60,
      backgroundColor: "#70bfec",
      position: "relative",
      left: 350,
    
    },
    icon: {
      margin: 14,  
   

    },
    addLocationContainer: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: "space-between",
     marginBottom: 20,
     marginTop: 20,
     width: "100%",
     alignItems: "center"

    },
  text: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: "space-between",
      fontSize: 15,
      fontWeight: "bold",
      right: 80

    }
  })
 