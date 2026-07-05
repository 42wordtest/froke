import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import NavigationBar from "./Components/Navigation/NavigationBar";
import { SingleLocation } from "./Components/Locations";
import { createStackNavigator } from "@react-navigation/stack";
import AchievementPage from "./Components/MyAccount/AchievementPage";
import LocationHistory from "./Components/MyAccount/LocationHistoryPage";
import AddLocationMap from "./Components/Maps";
import PostLocation from "./Components/Locations/PostLocation";
import AuthDetails from "./Components/Navigation/AccountSetup/Auth";
import { useState, useEffect } from "react";
import { UserProvider } from "./Components/Navigation/AccountSetup/UserContext";
import * as Location from "expo-location";
import { MainComponent } from "./Components/Navigation";
import Signup from "./Components/Navigation/AccountSetup/Signup";
import AllLocations from "./Components/Locations/AllLocations";
import { createLocationTable } from "./localDatabase/database";

const Stack = createStackNavigator();

export default function App() {
  const [user, setUser] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [locationLoading, setLocationLoading] = useState(true);

  useEffect(() => {
    createLocationTable();
    Location.requestForegroundPermissionsAsync()
      .then((status) => {
        if (status !== "granted") {
          setErrorMsg("Permission to access location was denied");
          return;
        }
      })
      .then(() => {
        return Location.getCurrentPositionAsync({});
      })
      .then((response) => {
        setUserLocation(response);
        setLocationLoading(false);
      });
  }, []);

  let text = "Waiting..";
  if (errorMsg) {
    text = errorMsg;
  } else if (userLocation) {
    text = JSON.stringify(userLocation);
  }

  if (!locationLoading) {
    return (
      <UserProvider>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
              name="Main"
              component={NavigationBar}
              options={{ headerShown: false }}
              initialParams={{ user, userLocation }}
            />
            <Stack.Screen
              name="Single Location"
              component={SingleLocation}
              options={{ headerTitle: "", headerTransparent: true }}
            />
            <Stack.Screen
              name="Achievements"
              component={AchievementPage}
              initialParams={{ user, setUser }}
            />
            <Stack.Screen
              name="Location History"
              component={LocationHistory}
              initialParams={{ user, setUser }}
            />
            <Stack.Screen
              name="Add Location Map"
              component={AddLocationMap}
              initialParams={{ user, setUser }}
            />
            <Stack.Screen
              name="Post Location"
              component={PostLocation}
              options={{ headerTitle: "", headerTransparent: true }}
              initialParams={{ user, setUser }}
            />
            <Stack.Screen
              name="Welcome"
              component={MainComponent}
              initialParams={{ user, setUser }}
            />
            <Stack.Screen name="Sign Up" component={Signup} />
            <Stack.Screen name="All Locations" component={AllLocations} />
          </Stack.Navigator>
        </NavigationContainer>
      </UserProvider>
    );
  }
}
