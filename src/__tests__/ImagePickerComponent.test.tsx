// Import necessary modules and functions
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { launchImageLibrary } from 'react-native-image-picker';

import ImagePickerComponent from '../components/ImagePickerComponent';
import { showError } from '../components/BasicComponents';

import { Messages } from '../utilities/Constants';

// Mock the react-native-image-picker module
jest.mock('react-native-image-picker', () => ({
    launchImageLibrary: jest.fn(),
    launchCamera: jest.fn(),
}));

// Mock the BasicComponents module
jest.mock('../components/BasicComponents', () => ({
    showError: jest.fn(),
}));

// Test suite for ImagePickerComponent
describe('ImagePickerComponent', () => {
    // Mock functions for setImageSource and setShowCamera
    const mockSetImageSource = jest.fn();
    const mockSetShowCamera = jest.fn();

    // Clear all mocks after each test
    afterEach(() => {
        jest.clearAllMocks();
    });

    // Test to ensure component renders without crashing
    it('renders without crashing', () => {
        const { getByText } = render(
            <ImagePickerComponent setImageSource={mockSetImageSource} setShowCamera={mockSetShowCamera} />
        );
        expect(getByText('Open Gallery')).toBeTruthy();
        expect(getByText('Open Camera')).toBeTruthy();
    });

    // Test to ensure error handling works correctly when opening the gallery
    it('handles error correctly', async () => {
        // Mock the launchImageLibrary function to throw an error
        (launchImageLibrary as jest.Mock).mockImplementationOnce(() => {
            throw new Error('Error');
        });

        const { getByText } = render(
            <ImagePickerComponent setImageSource={mockSetImageSource} setShowCamera={mockSetShowCamera} />
        );

        // Simulate pressing the "Open Gallery" button
        fireEvent.press(getByText('Open Gallery'));

        // Wait for the showError function to be called with the correct message
        await waitFor(() => {
            expect(showError).toHaveBeenCalledWith(Messages.FailedToOpenMediaPicker);
        });
    });
});
