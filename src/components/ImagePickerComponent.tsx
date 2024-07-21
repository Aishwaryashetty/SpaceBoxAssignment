import React from 'react';
import { StyleSheet, View } from 'react-native';
import { launchImageLibrary, launchCamera, ImageLibraryOptions, ImagePickerResponse } from 'react-native-image-picker';

import { showError } from '../utilities/CommonFunctions';
import { Colors, Messages } from '../utilities/Constants';
import { ImageData, ImagePickerComponentProps } from '../utilities/Interfaces';

import CustomButtonComponent from './CustomButtonComponent';



const ImagePickerComponent: React.FC<ImagePickerComponentProps> = ({ setImageSource, setShowDummy, testID }) => {
    const handleMediaPicker = async (pickerFunction: (options: ImageLibraryOptions) => Promise<ImagePickerResponse>) => {
        try {
            const options: ImageLibraryOptions = {
                mediaType: 'photo',
                maxWidth: 800,
                maxHeight: 800,
                quality: 1,
                selectionLimit: 9,
                presentationStyle: 'popover',
            };

            const result = await pickerFunction(options);

            if (result?.assets) {
                let ImageSet: ImageData[] = await Promise.all(result.assets.map(async (asset) => {
                    const uri = asset.uri || '';
                    return {
                        uri: uri,
                        fileName: asset.fileName || '',
                        fileSize: asset.fileSize || 0,
                        type: asset.type || '',
                    };
                }));
                setImageSource(ImageSet);
                setShowDummy(true);
            } else {
                showError(Messages.NoMediaSelected);
                setShowDummy(false);
            }
        } catch (error) {
            showError(Messages.FailedToOpenMediaPicker);
        }
    };

    const handleOpenGallery = () => handleMediaPicker(launchImageLibrary);
    const handleTakePhoto = () => handleMediaPicker(launchCamera);



    return (
        <View style={styles.row} testID={testID}>
            <CustomButtonComponent onPress={handleOpenGallery} title="Open Gallery" testID="open-gallery-button" />
            <CustomButtonComponent onPress={handleTakePhoto} title="Open Camera" testID="open-camera-button" />
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
