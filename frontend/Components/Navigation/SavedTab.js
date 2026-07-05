import { StyleSheet, Text, View, ScrollView } from 'react-native';
import {useEffect, useState} from 'react';
import SavedLocationCard from '../Locations/SavedLocationCard';
import {fetch} from "../../localDatabase/database"

export default function SavedTab({navigation}) {

    const [loading, setLoading] = useState(true)
    const [savedLocations, setSavedLocations] = useState([])

    useEffect(() => {
        fetch().then((res)=>{
            setSavedLocations(JSON.parse(res)._array)
            setLoading(false)     
        })
    }, [])

    return (
        <View style={styles.savedSpace}>
            <ScrollView >
            
                {
                savedLocations.map(location=>
                    <SavedLocationCard style={styles.locationCard} navigation={navigation} key={location.location_id} location={location}/>
                    )
                }
            
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    savedSpace:{
        flex:1, 
        flexGrow:1,
        flexWrap: 'nowrap',
        flexDirection: 'column',
        justifyContent:'space-evenly',
        alignContent:'center',
        margin:20
}
  });
  
