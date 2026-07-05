import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeScreen, MyAccount, Map, Saved, MainComponent } from './index';
import Icon from 'react-native-ico-material-design';
import { useUser } from '../Navigation/AccountSetup/UserContext';
import { View } from 'react-native';
import { useState, useEffect} from 'react'
import { getLocations } from '../../api';
import { getDistance } from 'geolib'
import freeStrokeImage from '../../assets/HalfFilled.png'
import Loading from '../Loading/Loading';

const Tab = createBottomTabNavigator();

export default function NavigationBar({route}) {
  const user = useUser();
  const {userLocation} = route.params
  const [closestLocations, setClosestLocations] = useState([])
  const [loadingNearbyLocations, setLoadingNearbyLocations] = useState(true);
  const [topRatedLocations, setTopRatedLocations] = useState([])
  const [loadingTopRatedLocations, setLoadingTopRatedLocations] = useState(true)
  const userLatitude = userLocation.coords.latitude
  const userLongitude = userLocation.coords.longitude

  useEffect(()=>{
    getLocations()
    .then(({locations})=>{
      const allLocationsDistance = locations.map((location)=>{
        const locationCopy = {...location}
        const stringLocation = JSON.stringify(locationCopy)
        const parsedLocation = JSON.parse(stringLocation)
        locationCopy.distance = getDistance({latitude: userLatitude, longitude : userLongitude},{latitude: parsedLocation.coordinates[1], longitude : parsedLocation.coordinates[0]})
        return locationCopy
      })
      const sortedLocations = allLocationsDistance.sort((a,b)=>a.distance-b.distance)
      const sortedTopLocations = allLocationsDistance.sort((a,b)=>a.avg_rating - b.avg_rating)
      setTopRatedLocations(sortedTopLocations.slice(-20).reverse())
      setClosestLocations(sortedLocations.slice(0,20))
      setTimeout(() => {
        setLoadingTopRatedLocations(false)
        setLoadingNearbyLocations(false);
    }, 1000);
    })
    .catch((err) => {
      console.log('error here <<<<', err);
    })
  },[])
  

  return (
    <>
      {loadingNearbyLocations && loadingTopRatedLocations ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F2F2F2' }}>
          <Loading style={{ width: 500, height: 1000 }} />
        </View>
      ) : (
        <Tab.Navigator initialRouteName='Home' screenOptions={{
          tabBarActiveTintColor: '#0F98E1',
        }}>
          <Tab.Screen
            name="Home"
            component={HomeScreen}
            options={{
              tabBarLabel: () => null,
              tabBarIcon: () => (
                <Icon name="home-button" color='#489FE1' />
              ),
            }}
            initialParams={{topRatedLocations, closestLocations }}
          />
          <Tab.Screen name="Map" component={Map} options={{
            tabBarLabel: () => null,
            tabBarIcon: () => (
              <Icon name="compass-with-white-needles" color='#489FE1' />
            ),
          }} />
          <Tab.Screen name="Saved" component={Saved} options={{
            tabBarLabel: () => null,
            tabBarIcon: () => (
              <Icon name="bookmark-ribbon" color='#489FE1' />
            ),
          }} />
          {user ? (
            <Tab.Screen name="My Account" component={MyAccount} options={{
              tabBarLabel: () => null,
              tabBarIcon: () => (
                <Icon name="user-shape" color='#489FE1' />
              ),
            }} />
          ) : (
            <Tab.Screen name="Log in" component={MainComponent} options={{
              tabBarLabel: () => null,
              tabBarIcon: () => (
                <Icon name="user-outline" color='#489FE1' />
              ),
            }} />
          )}
        </Tab.Navigator>
      )}
    </>
  );
}