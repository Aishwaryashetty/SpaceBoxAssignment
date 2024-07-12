import 'react-native';
import { it, describe, expect } from '@jest/globals';

import { Colors, Messages } from '../utilities/Constants';

describe('Constants', () => {
    describe('Colors', () => {
        it('should have the correct color codes', () => {
            expect(Colors.Primary).toBe('#606C38');
            expect(Colors.Secondary).toBe('#283618');
            expect(Colors.Background).toBe('#FEFAE0');
            expect(Colors.Accent).toBe('#DDA15E');
            expect(Colors.Highlight).toBe('#BC6C25');
            expect(Colors.TextPrimary).toBe('#FFFFFF');
            expect(Colors.TextSecondary).toBe('#283618');
        });
    });

    describe('Messages', () => {
        it('should contain correct messages for application use', () => {
            expect(Messages.FailedToCheckPermissions).toBe('Failed to check permissions.');
            expect(Messages.EnableCameraAndPhoto).toBe('Please enable camera and photo library access in your device settings to use this app.');
            expect(Messages.Success).toBe('Success');
            expect(Messages.Failure).toBe('Failure');
            expect(Messages.NoMediaSelected).toBe('No media selected');
            expect(Messages.FailedToUploadImage).toBe('Failed to upload image.');
            expect(Messages.ImageUploadedSuccessfully).toBe('Image uploaded successfully!');
        });
    });
});
