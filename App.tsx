import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
  Platform,
  Alert,
  SafeAreaView,
} from 'react-native';
import { v4 as uuidv4 } from 'uuid';

import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';

const App = () => {
  const [imageSource, setImageSource] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    checkPermissions();
  }, []);

  const checkPermissions = async () => {
    if (Platform.OS === 'ios') {
      const cameraPermission = await check(PERMISSIONS.IOS.CAMERA);
      const photoPermission = await check(PERMISSIONS.IOS.PHOTO_LIBRARY);
      if (
        cameraPermission !== RESULTS.GRANTED ||
        photoPermission !== RESULTS.GRANTED
      ) {
        requestPermissions();
      }
    } else {
      const cameraPermission = await check(PERMISSIONS.ANDROID.CAMERA);
      const photoPermission = await check(
        PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE
      );
      if (
        cameraPermission !== RESULTS.GRANTED ||
        photoPermission !== RESULTS.GRANTED
      ) {
        requestPermissions();
      }
    }
  };

  const generateFileName = () => {
    const uuid = uuidv4();
    return `${uuid}.jpg`;
  };

  const requestPermissions = async () => {
    if (Platform.OS === 'ios') {
      const cameraPermission = await request(PERMISSIONS.IOS.CAMERA);
      const photoPermission = await request(PERMISSIONS.IOS.PHOTO_LIBRARY);
      console.log('cameraPermission', cameraPermission);
      console.log('photoPermission', photoPermission);
      console.log('RESULTS', RESULTS);

      if (
        cameraPermission !== RESULTS.GRANTED ||
        photoPermission !== RESULTS.GRANTED
      ) {
        Alert.alert(
          'Permissions Required',
          'Please enable camera and photo library access in your device settings to use this app.',
          [{ text: 'OK', onPress: () => { } }]
        );
      }
    } else {
      const cameraPermission = await request(PERMISSIONS.ANDROID.CAMERA);
      const photoPermission = await request(
        PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE
      );
      if (
        cameraPermission !== RESULTS.GRANTED ||
        photoPermission !== RESULTS.GRANTED
      ) {
        Alert.alert(
          'Permissions Required',
          'Please enable camera and storage access in your device settings to use this app.',
          [{ text: 'OK', onPress: () => { } }]
        );
      }
    }
  };


  const handleOpenGallery = async () => {
    setShowCamera(true);
    const options = {
      mediaType: 'photo',
      maxWidth: 800,
      maxHeight: 800,
      quality: 1,
      selectionLimit: 1,
      presentationStyle: 'popover',
    };

    const result = await launchImageLibrary(options);

    console.log('result launchImageLibrary', result.assets[0].uri);

    if (result?.assets) {
      setImageSource(result.assets[0].uri);
    }
  };


  const handleTakePhoto = async () => {
    const options = {
      mediaType: 'photo',
      maxWidth: 800,
      maxHeight: 800,
      quality: 1,
      selectionLimit: 1,
      presentationStyle: 'popover',
    };

    const result = await launchCamera(options);

    console.log('result launchCamera', result.assets[0].uri);

    if (result?.assets) {
      setImageSource(result.assets[0].uri);
    }
  };

  const handleOpenCamera = () => {
    setShowCamera(true);
    setImageSource(null);
    handleTakePhoto();
  };

  const handleRetake = () => {
    setShowCamera(false);
    setImageSource(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={{ fontSize: 30, paddingLeft: 20 }}>Hey, Good Day!</Text>
      <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
        {imageSource ? (
          <Image
            style={styles.previewImage}
            source={{ uri: imageSource }}
          />
        ) : (
          <Text style={styles.messageText}>No image selected</Text>
        )}

        <View style={styles.buttonContainer}>
          {!showCamera && (
            <View>
              <TouchableOpacity style={styles.button} onPress={handleOpenGallery}>
                <Text style={styles.buttonText}>Open Gallery</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={handleOpenCamera}>
                <Text style={styles.buttonText}>Open Camera</Text>
              </TouchableOpacity>
            </View>
          )}

          {imageSource && (
            <TouchableOpacity style={styles.button} onPress={handleRetake}>
              <Text style={styles.buttonText}>Retake</Text>
            </TouchableOpacity>
          )}

          {images.length > 0 && (
            <View>
              <TouchableOpacity style={styles.button} onPress={handleRetake}>
                <Text style={styles.buttonText}>Home</Text>
              </TouchableOpacity>
            </View>
          )}

        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
    margin: 5
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  previewImage: {
    width: '100%',
    height: 300,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  messageText: {
    fontSize: 20,
    marginBottom: 20,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    marginHorizontal: 10,
    borderColor: 'beige',
    borderWidth: 2,
    backgroundColor: 'black',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default App;