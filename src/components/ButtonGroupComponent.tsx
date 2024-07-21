import React from 'react';
import { View, StyleSheet } from 'react-native';

import CustomButtonComponent from './CustomButtonComponent';

import { ButtonGroupComponentProps } from '../utilities/Interfaces';


const ButtonGroupComponent: React.FC<ButtonGroupComponentProps> = ({
    handleRetake,
    handleUploadImage,
    fetchImages,
    showDummy,
    imagesLength,
    imageSource,
    uploading,
    testID
}) => {
    return (
        <View style={styles.buttonContainer} testID={testID}>
            {!showDummy && imagesLength === 0 && (
                <CustomButtonComponent onPress={fetchImages} title="Fetch all uploaded Images" testID="fetch-images-button" />
            )}

            {showDummy && imageSource && !uploading && (
                <View>
                    <CustomButtonComponent onPress={handleRetake} title="Retake" testID="retake-button" />
                    <CustomButtonComponent onPress={handleUploadImage} title="Upload Image" testID="upload-image-button" />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    buttonContainer: {
        position: 'absolute',
        bottom: 20,
        width: '100%',
        alignItems: 'center',
    },
});

export default ButtonGroupComponent;
