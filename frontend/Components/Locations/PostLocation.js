import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  TouchableHighlight,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { uploadImage } from '../../localDatabase/firebase';
import { useUser } from '../Navigation/AccountSetup/UserContext';
import { postLocation } from '../../api';

export default function PostLocation({ route }) {
  const { draggableLocation } = route.params;
  const [locationName, setLocationName] = useState('');
  const [area, setArea] = useState('');
  const [locationDescription, setLocationDescription] = useState('');
  const [imageURI, setImageURI] = useState();
  const [locationSubmitted, setLocationSubmitted] = useState(false);
  const [isErr, setIsErr] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function ensureMediaLibraryPermission() {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to upload swimspots');
        return false;
      }
    }
    return true;
  }

  const selectImage = async function () {
    try {
      const hasPermission = await ensureMediaLibraryPermission();
      if (!hasPermission) return;

      const result = await ImagePicker.launchImageLibraryAsync({
        quality: 1,
      });

      if (result.canceled || !result.assets?.length) return;
      setImageURI(result.assets[0].uri);
      setIsErr(false);
      setLocationSubmitted(false);
    } catch (error) {
      setIsErr(true);
      console.log('Error selecting image:', error);
    }
  };

  const handleLocationNameChange = (input) => {
    setLocationName(input);
  };

  const handleAreaChange = (input) => {
    setArea(input);
  };

  const handleLocationDescriptionChange = (input) => {
    setLocationDescription(input);
  };

  const submitLocation = function () {
    if (submitting) return;
    if (!imageURI || !locationName || !area || !locationDescription) {
      alert('Please fill in all information');
      return;
    }
    setSubmitting(true);
    setIsErr(false);
    setLocationSubmitted(false);
    uploadImage(imageURI)
      .then((url) => {
        const coordinates = [draggableLocation.latitude, draggableLocation.longitude];
        const newLocation = {
          coordinates: coordinates,
          location_name: locationName,
          location_area: area,
          body: locationDescription,
          location_img_url: url,
        };
        return postLocation(newLocation);
      })
      .then(() => {
        setLocationSubmitted(true);
        setIsErr(false);

        setLocationName('');
        setArea('');
        setLocationDescription('');
        setImageURI();
      })
      .catch((error) => {
        setIsErr(true);
        setLocationSubmitted(false);
        console.log('Error submitting location:', error);
      })
      .finally(() => setSubmitting(false));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Enter New Swim Spot</Text>
      <Text style={styles.header2}>Location Details:</Text>
      <View style={styles.formContainer}>
        <TextInput
          style={styles.TextInput}
          placeholder="Location Name"
          value={locationName}
          onChangeText={handleLocationNameChange}
        />
        <TextInput
          style={styles.TextInput}
          placeholder="Area"
          value={area}
          onChangeText={handleAreaChange}
        />
        <TextInput
          style={[styles.TextInput, { height: 100 }]}
          placeholder="Location Description"
          value={locationDescription}
          onChangeText={handleLocationDescriptionChange}
          multiline={true}
          numberOfLines={4}
          textAlignVertical="top"
        />
        <TouchableHighlight onPress={() => setImageURI()}>
          <Image
            source={{ uri: imageURI !== undefined ? imageURI : undefined }}
            style={styles.imagePreview}
          />
        </TouchableHighlight>
        <TouchableOpacity style={styles.uploadButton} onPress={selectImage}>
          <Text style={styles.uploadButtonText}>UPLOAD IMAGE</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.submitButton}
          onPress={submitLocation}
          disabled={submitting}
        >
          <Text style={styles.submitButtonText}>{submitting ? 'SUBMITTING' : 'SUBMIT'}</Text>
        </TouchableOpacity>
        {locationSubmitted && <Text style={styles.locationSubmitted}>Location submitted!</Text>}
        {isErr && <Text style={styles.errorMessage}>Error posting location</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  formContainer: {
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 20,
    color: '#1937E0',
    backgroundColor: '#D6DBFE',
    width: '100%',
    textAlign: 'center',
    padding: 10,
    marginBottom: 30,
  },
  header2: {
    fontSize: 16,
    color: 'white',
    backgroundColor: '#77AAF5',
    width: '80%',
    padding: 6,
    borderRadius: 5,
    marginBottom: 8,
  },
  TextInput: {
    width: '100%',
    height: 40,
    borderColor: '#77AAF5',
    borderWidth: 1,
    borderRadius: 5,
    marginTop: 5,
    marginBottom: 10,
    padding: 10,
  },
  imagePreview: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  uploadButton: {
    marginBottom: 5,
    padding: 10,
    color: 'white',
    backgroundColor: '#77AAF5',
  },
  uploadButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  submitButton: {
    marginBottom: 5,
    padding: 10,
    color: 'white',
    backgroundColor: '#77AAF5',
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  locationSubmitted: {
    fontSize: 16,
    color: 'blue',
    marginTop: 10,
    fontWeight: 'bold',
  },
  errorMessage: {
    fontSize: 16,
    color: 'red',
    marginTop: 10,
    fontWeight: 'bold',
  },
});
