import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, SafeAreaView, Image } from 'react-native';
import uuid from 'react-native-uuid';
import storage from '@react-native-firebase/storage';

import { Colors, Messages } from '../utilities/Constants';
import { checkPermissions } from '../utilities/Permissions';
import { createThumbnail, showAlert, showError } from '../utilities/CommonFunctions';
import { ImageData } from '../utilities/Interfaces';

import ImageComponent from '../components/ImageComponent';
import ImageListComponent from '../components/ImageListComponent';
import ImagePickerComponent from '../components/ImagePickerComponent';
import UploadProgressComponent from '../components/UploadProgressComponent';
import ButtonGroupComponent from '../components/ButtonGroupComponent';
import SplashComponent from '../components/SplashComponent';

const App: React.FC = () => {
  const [imageSource, setImageSource] = useState<ImageData[]>([]);
  const [showDummy, setShowDummy] = useState(false);
  const [images, setImages] = useState<ImageData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [currentImage, setCurrentImage] = useState<ImageData | null>(null);
  const [remainingImages, setRemainingImages] = useState<number>(0);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    checkPermissions();
  }, []);

  const handleSplashTimeout = () => {
    setShowSplash(false);
  };

  const handleRetake = () => {
    setImageSource([]);
    setShowDummy(false);
    setCurrentImage(null);
    setRemainingImages(0);
    setImages([]);
  };

  const handleHomePress = () => {
    setImageSource([]);
    setShowDummy(false);
    setImages([]);
  };

  const uploadImages = async (images: ImageData[]) => {
    const failedUploads: ImageData[] = [];
    // let uploadCounter = 0;  // uncomment if you want to test retryFailedUploads function

    for (const image of images) {
      try {
        setCurrentImage(image);
        const fileName = `${uuid.v4()}.jpg`;
        const reference = storage().ref(`images/${fileName}`);

        const metadata = {
          customMetadata: {
            fileName: image.fileName,
            fileSize: image.fileSize.toString(),
            type: image.type,
          }
        };

        const task = reference.putFile(image.uri, metadata);

        // Simulate an error on every second upload - // uncomment if you want to test retryFailedUploads function
        // if (uploadCounter % 2 === 1) {
        //   throw new Error('Simulated upload error');
        // }

        task.on('state_changed', taskSnapshot => {
          const progress = (taskSnapshot.bytesTransferred / taskSnapshot.totalBytes) * 100;
          setUploadProgress(progress);
        });

        await task;


        setRemainingImages(prev => prev - 1);
      } catch (error) {
        failedUploads.push(image);
      }
      // uploadCounter++; // uncomment if you want to test retryFailedUploads function
    }

    return failedUploads;
  };

  const handleUploadImage = async () => {
    if (imageSource.length <= 0) {
      showAlert('Error', 'No image selected');
      return;
    }

    setUploading(true);
    setRemainingImages(imageSource.length);

    try {
      const failedUploads = await uploadImages(imageSource);


      if (failedUploads.length > 0) {
        showAlert('Error', `${failedUploads.length} images failed to upload. Do you want to retry the failed uploads?`, [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Retry', style: 'default', onPress: async () => await retryFailedUploads(failedUploads) }
        ]);
      } else {
        showAlert('Success', 'Images uploaded successfully');
      }

      handleRetake();
      fetchImages();

    } catch (error) {
      showError('Failed to upload images');
    } finally {
      setUploading(false);
    }
  };

  const retryFailedUploads = async (failedUploads: ImageData[]) => {

    if (failedUploads.length === 0) {
      showAlert(Messages.Error, Messages.NoFailedUploadsToRetry);
      return;
    }

    setUploading(true);
    setRemainingImages(failedUploads.length);

    try {
      const newFailedUploads = await uploadImages(failedUploads);

      if (newFailedUploads.length > 0) {
        showAlert('Error', `${newFailedUploads.length} images failed to upload again. Please check the image and try uploading again`);
      } else {
        showAlert('Success', 'All failed images uploaded successfully');

      }

      fetchImages();

    } catch (error) {
      showError('Failed to upload images');
    } finally {
      setUploading(false);
    }
    setRemainingImages(0);
  };

  const handleDelete = async (images: ImageData[]) => {
    const errors: ImageData[] = [];

    for (const image of images) {
      const imageRef = storage().refFromURL(image.uri);
      try {
        await imageRef.delete();
      } catch (err) {
        console.log('err', err);
        errors.push(image);
      }
    }

    if (errors.length > 0) {
      showError(Messages.FailedToDeleteImage);
    } else {
      fetchImages();
      showAlert(Messages.Success, Messages.ImageDeletedSuccessfully);
    }
  };

  const fetchImages = async () => {
    setImageSource([]);
    setImages([]);
    setShowDummy(false);
    setLoading(true);

    try {
      const listRef = storage().ref('images/');
      const result = await listRef.listAll();

      const imagesWithMetadata = await Promise.all(
        result.items.map(async (imageRef) => {
          const url = await imageRef.getDownloadURL();
          const metadata = await imageRef.getMetadata();
          const thumbnail = await createThumbnail(url);

          return {
            uri: url,
            fileName: metadata.customMetadata?.fileName || '',
            fileSize: Number(metadata.customMetadata?.fileSize) || 0,
            type: metadata.customMetadata?.type || '',
            thumbnail: thumbnail,
          };
        })
      );

      if (imagesWithMetadata.length === 0) {
        showAlert(Messages.NoImagesFound);
        return;
      }
      setImages(imagesWithMetadata);
    } catch (error) {
      showError(Messages.FailedToFetchImages);
    } finally {
      setLoading(false);
    }
  };

  if (showSplash) {
    return <SplashComponent onTimeout={handleSplashTimeout} />;
  }

  return (
    <SafeAreaView style={styles.container} testID="app">
      <Text style={styles.title}>Hey, Good Day!</Text>
      <View style={{ justifyContent: 'center', flex: 1 }}>
        {images.length === 0 && (
          <ImageComponent
            imageSource={imageSource}
            testID="image-upload-component"
          />
        )}

        {images.length === 0 && !showDummy && (
          <ImagePickerComponent
            setImageSource={setImageSource}
            setShowDummy={setShowDummy}
            testID="image-picker-component"
          />
        )}

        <ButtonGroupComponent
          handleRetake={handleRetake}
          handleUploadImage={handleUploadImage}
          fetchImages={fetchImages}
          showDummy={showDummy}
          imagesLength={images.length}
          testID="button-group-component"
          imageSource={imageSource}
          uploading={uploading}
        />

        {images.length > 0 && (
          <ImageListComponent
            images={images}
            handleDelete={handleDelete}
            handleHomePress={handleHomePress}
            testID="image-grid-component"
          />
        )}
      </View>
      {uploading && currentImage && (
        <UploadProgressComponent
          uploadProgress={uploadProgress}
          currentImage={currentImage}
          remainingImages={remainingImages}
          testID="upload-progress-component"
        />
      )}
      {loading && (
        <View style={styles.overlay}>
          <Image style={styles.loadingIndicator} source={require('../assets/gifs/loading.gif')} />
        </View>
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
  },
  retryButton: {
    backgroundColor: Colors.Secondary,
    padding: 15,
    borderRadius: 25,
    margin: 10,
    alignItems: 'center',
  },
  retryButtonText: {
    color: Colors.TextPrimary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
});

export default App;
