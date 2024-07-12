// Import necessary modules and functions
import React from 'react';
import { Alert } from 'react-native';
import { render, fireEvent, waitFor } from '@testing-library/react-native';

import ImageGridComponent from '../components/ImageGridComponent';

// Mock the Alert module from react-native
jest.mock('react-native/Libraries/Alert/Alert', () => {
    return {
        alert: jest.fn(),
    };
});

// Test suite for ImageGridComponent
describe('ImageGridComponent', () => {
    // Mock functions for handleDelete and handleHomePress
    const mockHandleDelete = jest.fn();
    const mockHandleHomePress = jest.fn();

    // Define default props to be used in the tests
    const defaultProps = {
        images: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg'],
        handleDelete: mockHandleDelete,
        handleHomePress: mockHandleHomePress,
        testID: 'image-grid-component',
    };

    // Test to ensure the component renders correctly with images
    it('renders correctly with images', () => {
        const { getAllByTestId } = render(<ImageGridComponent {...defaultProps} />);
        const imageItems = getAllByTestId('image-item');
        expect(imageItems.length).toBe(2);
    });

    // Test to ensure handleHomePress is called when the Home button is pressed
    it('calls handleHomePress when Home button is pressed', () => {
        const { getByTestId } = render(<ImageGridComponent {...defaultProps} />);
        const homeButton = getByTestId('home-button');
        fireEvent.press(homeButton);
        expect(mockHandleHomePress).toHaveBeenCalled();
    });

    // Test to ensure a confirm delete alert is shown when an image is pressed
    it('shows confirm delete alert when image is pressed', async () => {
        const { getAllByTestId } = render(<ImageGridComponent {...defaultProps} />);
        const imageItems = getAllByTestId('image-item');
        fireEvent.press(imageItems[0]);
        expect(Alert.alert).toHaveBeenCalledWith(
            "Confirm Delete",
            "Are you sure you want to delete this image?",
            expect.any(Array),
            { cancelable: true }
        );
    });

    // Test to ensure handleDelete is called when delete is confirmed
    it('calls handleDelete when delete is confirmed', async () => {
        const { getAllByTestId } = render(<ImageGridComponent {...defaultProps} />);
        const imageItems = getAllByTestId('image-item');
        fireEvent.press(imageItems[0]);

        // Simulate the user pressing "Delete" in the Alert
        await waitFor(() => {
            const alertDeleteButton = (Alert.alert as jest.Mock).mock.calls[0][2][1];
            alertDeleteButton.onPress();
        });

        expect(mockHandleDelete).toHaveBeenCalledWith('https://example.com/image1.jpg');
    });
});
