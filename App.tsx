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
  FlatList,
  Dimensions,
  ActivityIndicator,
  ListRenderItem,
} from 'react-native';
import uuid from 'react-native-uuid';
import { launchImageLibrary, launchCamera, MediaType, PhotoQuality, ImageLibraryOptions } from 'react-native-image-picker';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import storage from '@react-native-firebase/storage';

const windowWidth = Dimensions.get('window').width;
const itemWidth = 100; // Adjust this value based on your design
const numColumns = Math.floor(windowWidth / itemWidth);

const App: React.FC = () => {
  const [imageSource, setImageSource] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    checkPermissions();
  }, []);

  const checkPermissions = async () => {
    try {
      const permissions = Platform.OS === 'ios'
        ? [PERMISSIONS.IOS.CAMERA, PERMISSIONS.IOS.PHOTO_LIBRARY]
        : [PERMISSIONS.ANDROID.CAMERA, PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE];

      const results = await Promise.all(permissions.map(permission => check(permission)));
      if (results.some(result => result !== RESULTS.GRANTED)) {
        await requestPermissions(permissions);
      }
    } catch (error) {
      showError('Failed to check permissions.');
    }
  };

  const requestPermissions = async (permissions: any[]) => {
    try {
      const results = await Promise.all(permissions.map(permission => request(permission)));
      if (results.some(result => result !== RESULTS.GRANTED)) {
        showAlert(
          'Permissions Required',
          'Please enable camera and photo library access in your device settings to use this app.'
        );
      }
    } catch (error) {
      showError('Failed to request permissions.');
    }
  };

  const handleMediaPicker = async (pickerFunction: (options: ImageLibraryOptions) => Promise<any>) => {
    try {
      const options: ImageLibraryOptions = {
        mediaType: 'photo' as MediaType,
        maxWidth: 800,
        maxHeight: 800,
        quality: 1 as PhotoQuality,
        selectionLimit: 1,
        presentationStyle: 'popover',
      };

      const result = await pickerFunction(options);

      if (result?.assets && result.assets[0]?.uri) {
        setImageSource(result.assets[0].uri);
        setShowCamera(true);
      } else {
        console.log('No media selected');
      }
    } catch (error) {
      showError('Failed to open media picker.');
    }
  };

  const handleOpenGallery = () => handleMediaPicker(launchImageLibrary);
  const handleTakePhoto = () => handleMediaPicker(launchCamera);

  const handleOpenCamera = () => {
    setShowCamera(true);
    setImageSource(null);
    handleTakePhoto();
  };

  const handleRetake = () => {
    setImageSource(null);
    setShowCamera(false);
  };

  const handleUploadImage = async () => {
    if (!imageSource) {
      showAlert('No image selected', 'Please select an image first.');
      return;
    }

    const fileName = `${uuid.v4()}.jpg`;
    const reference = storage().ref(`images/${fileName}`);

    try {
      const task = reference.putFile(imageSource);
      task.on('state_changed', taskSnapshot => {
        console.log(`${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`);
      });

      await task;
      showAlert('Success', 'Image uploaded successfully!');
      handleRetake();
      fetchImages(); // Refresh the image list
    } catch (error) {
      showError('Failed to upload image.');
    }
  };

  const confirmDelete = (imageUrl: string) => {
    Alert.alert(
      'Delete Image',
      'Are you sure you want to delete this image?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => handleDelete(imageUrl) },
      ],
      { cancelable: true }
    );
  };

  const handleDelete = async (imageUrl: string) => {
    const imageRef = storage().refFromURL(imageUrl);

    try {
      await imageRef.delete();
      showAlert('Success', 'Image deleted successfully!');
      fetchImages(); // Refresh the image list
    } catch (error) {
      showError('Failed to delete image.');
    }
  };

  const fetchImages = async () => {
    setImageSource(null);
    setShowCamera(false);
    setLoading(true);

    try {
      const listRef = storage().ref('images/');
      const result = await listRef.listAll();
      const urls = await Promise.all(result.items.map((imageRef) => imageRef.getDownloadURL()));

      if (urls.length === 0) {
        showAlert('No Images found');
      }
      setImages(urls);
    } catch (error) {
      showError('Failed to fetch images.');
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (title: string, message?: string) => {
    Alert.alert(title, message, [{ text: 'OK' }]);
  };

  const showError = (message: string) => {
    console.error(message);
    Alert.alert('Error', message);
  };

  const renderImage: ListRenderItem<string> = ({ item }) => (
    <TouchableOpacity onPress={() => confirmDelete(item)} style={styles.imageContainer}>
      <Image source={{ uri: item }} style={styles.image} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Hey, Good Day!</Text>
      <View style={{ justifyContent: 'center', flex: 1 }}>
        {images.length === 0 && (
          <Image
            style={styles.previewImage}
            source={imageSource ? { uri: imageSource } : require('./src/assets/images/NoImage.jpeg')}
          />
        )}

        <View style={styles.buttonContainer}>
          {!showCamera && images.length === 0 && (
            <View>
              <View style={styles.row}>
                <TouchableOpacity style={styles.button} onPress={handleOpenGallery}>
                  <Text style={styles.buttonText}>Open Gallery</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={handleOpenCamera}>
                  <Text style={styles.buttonText}>Open Camera</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity style={styles.button} onPress={fetchImages}>
                <Text style={styles.buttonText}>Fetch all uploaded Images</Text>
              </TouchableOpacity>
            </View>
          )}

          {imageSource && (
            <>
              <TouchableOpacity style={styles.button} onPress={handleRetake}>
                <Text style={styles.buttonText}>Retake</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={handleUploadImage}>
                <Text style={styles.buttonText}>Use Photo</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        {images.length > 0 && (
          <View style={{ margin: 5, flex: 1 }}>
            <FlatList
              data={images}
              style={{ margin: 5 }}
              renderItem={renderImage}
              keyExtractor={(item, index) => index.toString()}
              numColumns={numColumns}
              columnWrapperStyle={styles.columnWrapper}
            />
            <TouchableOpacity style={styles.button} onPress={handleRetake}>
              <Text style={styles.buttonText}>Home</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      {loading && <ActivityIndicator style={styles.loadingIndicator} size="large" color="#0000ff" />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
    margin: 5,
  },
  title: {
    fontSize: 30,
    paddingLeft: 20,
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
  row: {
    flexDirection: 'row',
    margin: 5,
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
    textAlign: 'center',
  },
  imageContainer: {
    margin: 5,
    backgroundColor: 'green',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1 / numColumns, // Ensure each image container takes equal space
  },
  image: {
    width: itemWidth - 10, // Subtract some padding/margin
    height: itemWidth - 10, // Subtract some padding/margin
    borderRadius: 10,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  loadingIndicator: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -0.5 }, { translateY: -0.5 }],
  },
});

export default App;
