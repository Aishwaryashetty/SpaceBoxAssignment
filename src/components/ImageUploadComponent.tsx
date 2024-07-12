import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { BlurView } from '@react-native-community/blur';

import { Colors } from '../utilities/Constants';

interface ImageUploadComponentProps {
    imageSource: string | null;
    uploading: boolean;
    uploadProgress: number;
    testID: string;
}

const ImageUploadComponent: React.FC<ImageUploadComponentProps> = ({
    imageSource,
    uploading,
    uploadProgress,
    testID
}) => {
    return (
        <View style={styles.container} testID={testID}>
            <View style={styles.previewWrapper}>
                <Image
                    style={styles.previewImage}
                    source={imageSource ? { uri: imageSource } : require('../assets/images/waiting.png')}
                    testID="preview-image"
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
    overlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 0, 0.3)',
    },
});

export default ImageUploadComponent;
