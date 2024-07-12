import React from 'react';
import { View, StyleSheet } from 'react-native';

import CustomButtonComponent from './CustomButtonComponent';

interface ButtonGroupComponentProps {
    handleRetake: () => void;
    handleUploadImage: () => void;
    fetchImages: () => void;
    showCamera: boolean;
    imagesLength: number;
    imageSource: string | null;
    uploading: boolean;
    testID: string;
}

const ButtonGroupComponent: React.FC<ButtonGroupComponentProps> = ({
    handleRetake,
    handleUploadImage,
    fetchImages,
    showCamera,
    imagesLength,
    imageSource,
    uploading,
    testID
}) => {
    return (
        <View style={styles.buttonContainer} testID={testID}>
            {!showCamera && imagesLength === 0 && (
                <CustomButtonComponent onPress={fetchImages} title="Fetch all uploaded Images" testID="fetch-images-button" />
            )}

            {showCamera && imageSource && !uploading && (
                <View>
                    <CustomButtonComponent onPress={handleRetake} title="Retake" testID="retake-button" />
                    <CustomButtonComponent onPress={handleUploadImage} title="Use Photo" testID="use-photo-button" />
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
