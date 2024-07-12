import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, SafeAreaView, ActivityIndicator } from 'react-native';
import uuid from 'react-native-uuid';
import storage from '@react-native-firebase/storage';

import { Colors, Messages } from '../utilities/Constants';
import { checkPermissions } from '../utilities/Permissions';
import { showAlert, showError } from '../components/BasicComponents';

import ImageUploadComponent from '../components/ImageUploadComponent';
import ImageGridComponent from '../components/ImageGridComponent';
import ImagePickerComponent from '../components/ImagePickerComponent';
import UploadProgressComponent from '../components/UploadProgressComponent';
import ButtonGroupComponent from '../components/ButtonGroupComponent';

const App: React.FC = () => {
  const [imageSource, setImageSource] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  useEffect(() => {
    checkPermissions();
  }, []);

  const handleRetake = () => {
    setImageSource(null);
    setShowCamera(false);
  };

  const handleHomePress = () => {
    setImageSource(null);
    setShowCamera(false);
    setImages([]);
  };

  const handleUploadImage = async () => {
    if (!imageSource) {
      showAlert(Messages.NoImageSelected);
      return;
    }

    setUploading(true);

    const fileName = `${uuid.v4()}.jpg`;
    const reference = storage().ref(`images/${fileName}`);

    try {
      const task = reference.putFile(imageSource);

      task.on('state_changed', taskSnapshot => {
        const progress = (taskSnapshot.bytesTransferred / taskSnapshot.totalBytes) * 100;
        setUploadProgress(progress);
      });

      await task;
      showAlert(Messages.Success, Messages.ImageUploadedSuccessfully);
      handleRetake();
      fetchImages();
    } catch (error) {
      showError(Messages.FailedToUploadImage);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (imageUrl: string) => {
    const imageRef = storage().refFromURL(imageUrl);

    try {
      await imageRef.delete();
      showAlert(Messages.Success, Messages.ImageDeletedSuccessfully);
      fetchImages();
    } catch (error) {
      showError(Messages.FailedToDeleteImage);
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
        showAlert(Messages.NoImagesFound);
      }
      setImages(urls);
    } catch (error) {
      showError(Messages.FailedToFetchImages);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} testID="app">
      <Text style={styles.title}>Hey, Good Day!</Text>
      <View style={{ justifyContent: 'center', flex: 1 }}>
        {images.length === 0 && (
          <ImageUploadComponent
            imageSource={imageSource}
            uploading={uploading}
            uploadProgress={uploadProgress}
            testID="image-upload-component"
          />
        )}

        {images.length === 0 && !showCamera && (
          <ImagePickerComponent
            setImageSource={setImageSource}
            setShowCamera={setShowCamera}
            testID="image-picker-component"
          />
        )}

        <ButtonGroupComponent
          handleRetake={handleRetake}
          handleUploadImage={handleUploadImage}
          fetchImages={fetchImages}
          showCamera={showCamera}
          imagesLength={images.length}
          testID="button-group-component"
          imageSource={imageSource}
          uploading={uploading}
        />

        {images.length > 0 && (
          <ImageGridComponent
            images={images}
            handleDelete={handleDelete}
            handleHomePress={handleHomePress}
            testID="image-grid-component"
          />
        )}
      </View>
      {loading && <ActivityIndicator style={styles.loadingIndicator} size="large" color={Colors.Accent} testID="loading-indicator" />}
      {uploading && imageSource && (
        <UploadProgressComponent
          uploadProgress={uploadProgress}
          imageSource={imageSource}
          testID="upload-progress-component"
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.Background,
    padding: 10,
  },
  title: {
    fontSize: 28,
    color: Colors.Secondary,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  loadingIndicator: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -0.5 }, { translateY: -0.5 }],
  },
});

export default App;
