import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { getDistance } from 'geolib';
import { HomeScreen, MyAccount, Map, Saved, MainComponent } from './index';
import { useUser } from '../Navigation/AccountSetup/UserContext';
import { getLocations } from '../../api';
import { LoadingSkeleton, ErrorState } from '../UI/States';
import { colors } from '../../design/theme';

const Tab = createBottomTabNavigator();

function tabIcon(routeName, focused) {
  const iconMap = {
    Home: focused ? 'home' : 'home-outline',
    Map: focused ? 'map' : 'map-outline',
    Saved: focused ? 'bookmark' : 'bookmark-outline',
    Account: focused ? 'person-circle' : 'person-circle-outline',
  };
  return iconMap[routeName] || 'ellipse-outline';
}

export default function NavigationBar({ route }) {
  const user = useUser();
  const { userLocation } = route.params;
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userCoords = useMemo(() => {
    if (!userLocation?.coords) return null;
    return {
      latitude: userLocation.coords.latitude,
      longitude: userLocation.coords.longitude,
    };
  }, [userLocation]);

  const loadLocations = useCallback(
    (forceRefresh = false) => {
      setLoading(true);
      setError(null);
      getLocations({ forceRefresh })
        .then(({ locations: apiLocations }) => {
          const withDistance = apiLocations.map((location) => {
            if (!userCoords) return location;
            return {
              ...location,
              distance: getDistance(userCoords, {
                latitude: location.latitude,
                longitude: location.longitude,
              }),
            };
          });
          setLocations(withDistance);
        })
        .catch((err) => {
          console.log('Government location fetch failed', err);
          setError(
            'We could not load official bathing water locations. Check your connection and try again.'
          );
        })
        .finally(() => setLoading(false));
    },
    [userCoords]
  );

  useEffect(() => {
    loadLocations(false);
  }, [loadLocations]);

  const closestLocations = useMemo(() => {
    return [...locations]
      .sort(
        (a, b) => (a.distance ?? Number.MAX_SAFE_INTEGER) - (b.distance ?? Number.MAX_SAFE_INTEGER)
      )
      .slice(0, 30);
  }, [locations]);

  const featuredLocations = useMemo(() => {
    return [...locations]
      .sort((a, b) => a.bathingWaterName.localeCompare(b.bathingWaterName))
      .slice(0, 30);
  }, [locations]);

  if (loading) return <LoadingSkeleton label="Loading official bathing waters" />;
  if (error) return <ErrorState message={error} onRetry={() => loadLocations(true)} />;

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.blue,
        tabBarInactiveTintColor: colors.muted,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '700',
          paddingBottom: 4,
        },
        tabBarStyle: {
          minHeight: 72,
          paddingTop: 8,
          paddingBottom: 10,
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
        },
        tabBarIcon: ({ focused, color }) => (
          <Ionicons name={tabIcon(route.name, focused)} color={color} size={24} />
        ),
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        initialParams={{
          locations,
          closestLocations,
          featuredLocations,
          reloadLocations: loadLocations,
          userCoords,
        }}
      />
      <Tab.Screen name="Map" component={Map} initialParams={{ locations, userCoords }} />
      <Tab.Screen name="Saved" component={Saved} />
      <Tab.Screen name="Account" component={user ? MyAccount : MainComponent} />
    </Tab.Navigator>
  );
}
