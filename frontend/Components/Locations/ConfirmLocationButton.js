import {  StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ConfirmLocationButton({ draggableLocation ,navigation}) {

    const handlePress = () => {
        navigation.navigate('Post Location', {draggableLocation});
      };
console.log(draggableLocation,"IN BUTTON")
    return (
      <View style={{position: 'absolute', flex:1, bottom: 20}}>
           <TouchableOpacity onPress={handlePress}
           style={styles.touchables}>
              <Text style={styles.text}>Confirm Location</Text>
          </TouchableOpacity>
      </View>
    );
  }



  const styles = StyleSheet.create({
 touchables: {
      borderColor: 'white',
      borderWidth: 3,
      borderRadius: 12,
      backgroundColor: "#4578DE",
      padding: 22,
    },
   text: {
    color: "white",
    fontWeight: "bold",
    fontSize: 15
    } 
    
  })
 