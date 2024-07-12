import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';

import ButtonGroupComponent from '../components/ButtonGroupComponent';

jest.mock('../utilities/Constants', () => ({
    Colors: {
        // Mock any colors or constants used
    },
}));

describe('ButtonGroupComponent', () => {
    const mockHandleRetake = jest.fn();
    const mockHandleUploadImage = jest.fn();
    const mockFetchImages = jest.fn();

    // Helper function to render the component with props
    const renderComponent = (props) => {
        return render(
            <ButtonGroupComponent
                handleRetake={mockHandleRetake}
                handleUploadImage={mockHandleUploadImage}
                fetchImages={mockFetchImages}
                showCamera={props.showCamera}
                imagesLength={props.imagesLength}
                imageSource={props.imageSource}
                uploading={props.uploading}
                testID="button-group"
            />
        );
    };

    // Test 1: Rendering when showCamera is false and imagesLength is 0
    test('renders fetch images button when showCamera is false and imagesLength is 0', () => {
        const { getByTestId } = renderComponent({
            showCamera: false,
            imagesLength: 0,
            imageSource: null,
            uploading: false,
        });

        // Check if fetch images button is rendered
        expect(getByTestId('fetch-images-button')).toBeTruthy();
    });

    // Test 2: Rendering when showCamera is true and imageSource is null and not uploading
    test('renders retake and use photo buttons when showCamera is true, imageSource is null, and not uploading', () => {
        const { getByTestId } = renderComponent({
            showCamera: true,
            imagesLength: 0,
            imageSource: null,
            uploading: false,
        });

        // Check if retake and use photo buttons are rendered
        expect(getByTestId('retake-button')).toBeTruthy();
        expect(getByTestId('use-photo-button')).toBeTruthy();
    });

    // Test 3: Clicking on fetch images button
    test('handles fetch images button click', () => {
        const { getByTestId } = renderComponent({
            showCamera: false,
            imagesLength: 0,
            imageSource: null,
            uploading: false,
        });

        // Simulate click on fetch images button
        fireEvent.press(getByTestId('fetch-images-button'));

        // Expect the mock function to have been called
        expect(mockFetchImages).toHaveBeenCalledTimes(1);
    });

    // Test 4: Clicking on retake button
    test('handles retake button click', () => {
        const { getByTestId } = renderComponent({
            showCamera: true,
            imagesLength: 0,
            imageSource: null,
            uploading: false,
        });

        // Simulate click on retake button
        fireEvent.press(getByTestId('retake-button'));

        // Expect the mock function to have been called
        expect(mockHandleRetake).toHaveBeenCalledTimes(1);
    });

    // Test 5: Clicking on use photo button
    test('handles use photo button click', () => {
        const { getByTestId } = renderComponent({
            showCamera: true,
            imagesLength: 0,
            imageSource: null,
            uploading: false,
        });

        // Simulate click on use photo button
        fireEvent.press(getByTestId('use-photo-button'));

        // Expect the mock function to have been called
        expect(mockHandleUploadImage).toHaveBeenCalledTimes(1);
    });
});
