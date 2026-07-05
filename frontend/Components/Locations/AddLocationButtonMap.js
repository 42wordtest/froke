import { StyleSheet, View, Pressable } from 'react-native';
import Icon from 'react-native-ico-material-design';
import { useUser } from '../Navigation/AccountSetup/UserContext';

export default function AddLocationButton({navigation}) {


const user = useUser();
const handlePress = () => {
  if (user) {
    navigation.navigate('Add Location Map');
  } else {
    navigation.navigate("Log in");
  }
};


    return (
      <View style={{position: 'absolute', top: 180, right:40}}>
           <Pressable 
            onPress={handlePress} 
            style={styles.Pressable}
            >
             <Icon name="add-plus-button" height="40" width="40" style={styles.icon} color='#4578DE'/>
          </Pressable>  
      </View>
    );
  }

  const styles = StyleSheet.create({
    Pressable: {
      borderColor: '#4578DE',
      borderWidth: 4,
      borderRadius: 40,
      backgroundColor: 'white'
    },
    icon: {
      margin: 10,
    }
  })
 