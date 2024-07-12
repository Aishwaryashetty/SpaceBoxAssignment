import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { BlurView } from '@react-native-community/blur';
import { Colors } from '../utilities/Constants';

interface ImageUploadComponentProps {
    imageSource: string | null;
    uploading: boolean;
    uploadProgress: number;
    handleRetake: () => void;
    handleUploadImage: () => void;
}

const ImageUploadComponent: React.FC<ImageUploadComponentProps> = ({
    imageSource,
    uploading,
    uploadProgress,
    handleRetake,
    handleUploadImage
}) => {
    return (
        <View style={styles.container}>
            <View style={styles.previewWrapper}>
                <Image
                    style={styles.previewImage}
                    source={imageSource ? { uri: imageSource } : require('../assets/images/waiting.png')}
                />
                {imageSource && uploading && (
                    <BlurView style={styles.absoluteBlur} blurType="light" blurAmount={10}>
                        <View style={[styles.overlay, { backgroundColor: 'rgba(255, 255, 0, 0.3)' }]}>
                            <View style={styles.uploadProgressContainer}>
                                <Text style={styles.uploadProgressText}>Uploading: {Math.round(uploadProgress)}%</Text>
                            </View>
                        </View>
                    </BlurView>
                )}
            </View>
            {imageSource && !uploading && (
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
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
    },
    previewWrapper: {
        position: 'relative',
        width: '100%',
        height: 300,
        marginBottom: 20,
    },
    previewImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
        borderRadius: 10,
    },
    absoluteBlur: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center',
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
    button: {
        backgroundColor: Colors.Secondary,
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 25,
        marginHorizontal: 10,
        marginVertical: 5,
        elevation: 3,
    },
    buttonText: {
        color: Colors.TextPrimary,
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 0, 0.3)',
    },
});

export default ImageUploadComponent;
