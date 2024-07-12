import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { BlurView } from '@react-native-community/blur';
import { Colors } from '../utilities/Constants';

interface UploadProgressComponentProps {
    uploadProgress: number;
    imageSource: string;
}

const UploadProgressComponent: React.FC<UploadProgressComponentProps> = ({ uploadProgress, imageSource }) => {
    return (
        <BlurView style={styles.absoluteBlur} blurType="light" blurAmount={10}>
            <View style={[styles.overlay, { backgroundColor: 'rgba(255, 255, 0, 0.3)' }]}>
                <View style={styles.uploadProgressContainer}>
                    <Text style={styles.uploadProgressText}>Uploading: {Math.round(uploadProgress)}%</Text>
                    <Image source={{ uri: imageSource }} style={styles.uploadImagePreview} />
                </View>
            </View>
        </BlurView>
    );
};

const styles = StyleSheet.create({
    absoluteBlur: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
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
