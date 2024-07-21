import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { BlurView } from '@react-native-community/blur';

import { Colors } from '../utilities/Constants';
import { UploadProgressComponentProps } from '../utilities/Interfaces';


const UploadProgressComponent: React.FC<UploadProgressComponentProps> = ({ uploadProgress, currentImage, remainingImages, testID }) => {
    return (
        <BlurView style={styles.absoluteBlur} blurType="light" blurAmount={10}>
            <View style={[styles.overlay, { backgroundColor: 'rgba(255, 255, 0, 0.3)' }]} testID={testID}>
                <View style={styles.uploadProgressContainer}>
                    <Text style={styles.uploadProgressText}>Uploading: {Math.round(uploadProgress)}%</Text>
                    <Text style={styles.uploadProgressText}>{remainingImages} images left</Text>
                    <Image source={{ uri: currentImage.uri }} style={styles.uploadImagePreview} testID="upload-image-preview" />
                </View>
            </View>
        </BlurView>
    );
};

const styles = StyleSheet.create({
    absoluteBlur: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 0, 0.3)',
    },
    uploadProgressContainer: {
        backgroundColor: Colors.Secondary,
        padding: 20,
        borderRadius: 20,
        alignItems: 'center',
        elevation: 10,
    },
    uploadProgressText: {
        fontSize: 20,
        color: Colors.TextPrimary,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    uploadImagePreview: {
        width: 150,
        height: 150,
        borderRadius: 10,
        borderColor: Colors.Primary,
        borderWidth: 2,
        marginTop: 10,
    },
});

export default UploadProgressComponent;
