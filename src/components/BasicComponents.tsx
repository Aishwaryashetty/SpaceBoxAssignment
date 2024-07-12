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