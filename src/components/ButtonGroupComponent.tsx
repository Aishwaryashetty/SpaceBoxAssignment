import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Colors } from '../utilities/Constants';

interface ButtonGroupComponentProps {
    handleRetake: () => void;
    handleUploadImage: () => void;
    fetchImages: () => void;
    showCamera: boolean;
    imagesLength: number;
}

const ButtonGroupComponent: React.FC<ButtonGroupComponentProps> = ({ handleRetake, handleUploadImage, fetchImages, showCamera, imagesLength }) => {
    return (
        <View style={styles.buttonContainer}>
            {!showCamera && imagesLength === 0 && (
                <View>
                    <TouchableOpacity style={styles.button} onPress={fetchImages}>
                        <Text style={styles.buttonText}>Fetch all uploaded Images</Text>
                    </TouchableOpacity>
                </View>
            )}

            {showCamera && (
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
    buttonContainer: {
        position: 'absolute',
        bottom: 20,
        width: '100%',
        alignItems: 'center',
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
});

export default ButtonGroupComponent;
