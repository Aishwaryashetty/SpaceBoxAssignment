// Import necessary modules and functions
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';

import { checkPermissions, requestPermissions } from '../utilities/Permissions';
import { Messages } from '../utilities/Constants';

import { showAlert, showError } from '../components/BasicComponents';

// Mock the imported modules for testing purposes
jest.mock('react-native-permissions', () => ({
    check: jest.fn(),
    request: jest.fn(),
    PERMISSIONS: {
        IOS: {
            CAMERA: 'ios.permission.CAMERA',
            PHOTO_LIBRARY: 'ios.permission.PHOTO_LIBRARY',
        },
        ANDROID: {
            CAMERA: 'android.permission.CAMERA',
            READ_EXTERNAL_STORAGE: 'android.permission.READ_EXTERNAL_STORAGE',
        },
    },
    RESULTS: {
        GRANTED: 'granted',
        DENIED: 'denied',
    },
}));

jest.mock('../components/BasicComponents', () => ({
    showAlert: jest.fn(),
    showError: jest.fn(),
}));

// Test suite for Permissions Utilities
describe('Permissions Utilities', () => {
    // Clear all mocks after each test
    afterEach(() => {
        jest.clearAllMocks();
    });

    // Test suite for checkPermissions function
    describe('checkPermissions', () => {

        // Test to ensure permissions are requested if not granted
        it('requests permissions if not granted', async () => {
            (check as jest.Mock)
                .mockResolvedValueOnce(RESULTS.DENIED)
                .mockResolvedValueOnce(RESULTS.DENIED);
            (request as jest.Mock)
                .mockResolvedValueOnce(RESULTS.GRANTED)
                .mockResolvedValueOnce(RESULTS.GRANTED);

            await checkPermissions();

            expect(check).toHaveBeenCalledTimes(2);
            expect(request).toHaveBeenCalledTimes(2);
            expect(showAlert).not.toHaveBeenCalled();
            expect(showError).not.toHaveBeenCalled();
        });

        // Test to ensure error is shown if checking permissions fails
        it('shows error if checking permissions fails', async () => {
            (check as jest.Mock).mockImplementationOnce(() => {
                throw new Error('Check permission error');
            });

            await checkPermissions();

            expect(showError).toHaveBeenCalledWith(Messages.FailedToCheckPermissions);
        });

        // Test to ensure permissions are not requested if already granted
        it('does not request permissions if already granted', async () => {
            (check as jest.Mock).mockResolvedValue(RESULTS.GRANTED);

            await checkPermissions();

            expect(check).toHaveBeenCalledTimes(2);
            expect(request).not.toHaveBeenCalled();
        });
    });

    // Test suite for requestPermissions function
    describe('requestPermissions', () => {

        // Test to ensure alert is shown if permissions are denied
        it('shows alert if permissions are denied', async () => {
            (request as jest.Mock).mockResolvedValueOnce(RESULTS.DENIED);

            await requestPermissions([PERMISSIONS.IOS.CAMERA]);

            expect(request).toHaveBeenCalledTimes(1);
            expect(showAlert).toHaveBeenCalledWith(
                'Permissions Required',
                Messages.EnableCameraAndPhoto
            );
        });

        // Test to ensure error is shown if requesting permissions fails
        it('shows error if requesting permissions fails', async () => {
            (request as jest.Mock).mockImplementationOnce(() => {
                throw new Error('Request permission error');
            });

            await requestPermissions([PERMISSIONS.IOS.CAMERA]);

            expect(showError).toHaveBeenCalledWith(Messages.FailedToRequestPermissions);
        });

        // Test to ensure alert is not shown if permissions are granted
        it('does not show alert if permissions are granted', async () => {
            (request as jest.Mock).mockResolvedValue(RESULTS.GRANTED);

            await requestPermissions([PERMISSIONS.IOS.CAMERA]);

            expect(showAlert).not.toHaveBeenCalled();
        });
    });
});
