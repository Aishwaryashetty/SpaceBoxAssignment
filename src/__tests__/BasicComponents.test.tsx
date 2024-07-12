import { Alert } from 'react-native';

import { showAlert, showError } from '../components/BasicComponents';

jest.mock('react-native', () => ({
    Alert: {
        alert: jest.fn(),
    },
}));

describe('showAlert', () => {
    it('calls Alert.alert with the correct arguments', () => {
        const title = 'Test Title';
        const message = 'Test Message';
        const buttons = [
            { text: 'Cancel', style: 'cancel' as 'cancel', onPress: jest.fn() },
            { text: 'OK', onPress: jest.fn() },
        ];
        const options = { cancelable: false };

        showAlert(title, message, buttons, options);

        expect(Alert.alert).toHaveBeenCalledWith(
            title,
            message,
            buttons,
            options
        );
    });

    it('calls Alert.alert with default button when no buttons are provided', () => {
        const title = 'Test Title';
        const message = 'Test Message';

        showAlert(title, message);

        expect(Alert.alert).toHaveBeenCalledWith(
            title,
            message,
            [{ text: 'OK' }],
            undefined
        );
    });
});

describe('showError', () => {
    it('calls Alert.alert with the correct arguments', () => {
        const message = 'Test Error Message';

        console.error = jest.fn();

        showError(message);

        expect(console.error).toHaveBeenCalledWith(message);
        expect(Alert.alert).toHaveBeenCalledWith('Error', message);
    });
});
