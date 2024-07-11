import { Platform } from 'react-native';
import { check, request, PERMISSIONS, RESULTS, Permission, PermissionStatus } from 'react-native-permissions';

import { Messages } from './Constants';
import { showAlert, showError } from '../components/BasicComponents';

export const checkPermissions = async (): Promise<void> => {
    try {
        const permissions: Permission[] = Platform.OS === 'ios'
            ? [PERMISSIONS.IOS.CAMERA, PERMISSIONS.IOS.PHOTO_LIBRARY]
            : [PERMISSIONS.ANDROID.CAMERA, PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE];

        const results: PermissionStatus[] = await Promise.all(permissions.map(permission => check(permission)));
        if (results.some(result => result !== RESULTS.GRANTED)) {
            await requestPermissions(permissions);
        }
    } catch (error) {
        showError(Messages.FailedToCheckPermissions);
    }
};

export const requestPermissions = async (permissions: Permission[]): Promise<void> => {
    try {
        const results: PermissionStatus[] = await Promise.all(permissions.map(permission => request(permission)));
        if (results.some(result => result !== RESULTS.GRANTED)) {
            showAlert(
                'Permissions Required',
                Messages.EnableCameraAndPhoto
            );
        }
    } catch (error) {
        showError(Messages.FailedToRequestPermissions);
    }
};
