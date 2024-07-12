import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { launchImageLibrary, launchCamera, ImageLibraryOptions, ImagePickerResponse } from 'react-native-image-picker';

import { showError } from '../components/BasicComponents';
import { Colors, Messages } from '../utilities/Constants';

interface ImagePickerComponentProps {
    setImageSource: (uri: string | null) => void;
    setShowCamera: (show: boolean) => void;
    testID?: string;
}

const ImagePickerComponent: React.FC<ImagePickerComponentProps> = ({ setImageSource, setShowCamera, testID }) => {
    const handleMediaPicker = async (pickerFunction: (options: ImageLibraryOptions) => Promise<ImagePickerResponse>) => {
        try {
            const options: ImageLibraryOptions = {
                mediaType: 'photo',
                maxWidth: 800,
                maxHeight: 800,
                quality: 1,
                selectionLimit: 1,
                presentationStyle: 'popover',
            };

            const result = await pickerFunction(options);

            if (result?.assets && result.assets[0]?.uri) {
                setImageSource(result.assets[0].uri);
                setShowCamera(true);
            } else {
                console.log(Messages.NoMediaSelected);
                setShowCamera(false);
            }
        } catch (error) {
            showError(Messages.FailedToOpenMediaPicker);
        }
    };

    const handleOpenGallery = () => handleMediaPicker(launchImageLibrary);
    const handleTakePhoto = () => handleMediaPicker(launchCamera);

    return (
        <View style={styles.row} testID={testID}>
            <TouchableOpacity style={styles.button} onPress={handleOpenGallery} testID="open-gallery-button">
                <Text style={styles.buttonText}>Open Gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleTakePhoto} testID="open-camera-button">
                <Text style={styles.buttonText}>Open Camera</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 20,
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

export default ImagePickerComponent;
