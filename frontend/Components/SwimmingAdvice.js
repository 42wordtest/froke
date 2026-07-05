import { Linking, StyleSheet, Text, View, TouchableOpacity} from 'react-native';


export default function SwimmingAdvice() {
    return (
      <View >
        <TouchableOpacity style={styles.SwimmingAdviceContainer} onPress={() => Linking.openURL('https://rnli.org/safety/choose-your-activity/open-water-swimming#')}>
  <Text style={styles.SwimmingAdviceText}>
  Swimming Advice
  </Text>
</TouchableOpacity>
      </View>
    );
  }

  const styles = StyleSheet.create({
    SwimmingAdviceText: {
  color: "white",
  fontWeight: "bold",
  alignItems: "center",
  fontSize: 15
  
    },
    SwimmingAdviceContainer:{
      backgroundColor: "#94c3df",
      padding: 17,
      borderRadius:10,
      elevation: 50,
      marginLeft:15,
    
    }
  })