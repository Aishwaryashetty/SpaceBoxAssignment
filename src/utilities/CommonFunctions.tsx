import ImageResizer from 'react-native-image-resizer';

export const createThumbnail = async (uri: string): Promise<string> => {
    try {
        const response = await ImageResizer.createResizedImage(uri, 100, 100, 'PNG', 80);
        return response.uri;
    } catch (err) {
        console.error(err);
        return uri;
    }
};

import { Alert, AlertOptions } from 'react-native';

export const showAlert = (
    title: string,
    message?: string,
    buttons?: { text: string, style?: 'cancel' | 'destructive' | 'default', onPress?: () => void }[],
    options?: AlertOptions
) => {
    Alert.alert(
        title,
        message,
        buttons ?? [{ text: 'OK' }],
        options
    );
};


export const showError = (message: string) => {
    console.error(message);
    Alert.alert('Error', message);
};