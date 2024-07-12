// Import necessary modules and functions
import React from 'react';
import { render } from '@testing-library/react-native';

import ImageUploadComponent from '../components/ImageUploadComponent';

// Test suite for ImageUploadComponent
describe('ImageUploadComponent', () => {
    // Define default props for the component
    const defaultProps = {
        imageSource: null,
        uploading: false,
        uploadProgress: 0,
        testID: 'image-upload-component',
    };

    // Test to ensure component renders correctly with a placeholder image
    it('renders correctly with a placeholder image', () => {
        const { getByTestId } = render(<ImageUploadComponent {...defaultProps} />);
        const image = getByTestId('preview-image');
        expect(image.props.source).toEqual(require('../assets/images/waiting.png'));
    });

    // Test to ensure component renders correctly with an image source
    it('renders correctly with an image source', () => {
        const props = {
            ...defaultProps,
            imageSource: 'https://example.com/image.jpg',
        };
        const { getByTestId } = render(<ImageUploadComponent {...props} />);
        const image = getByTestId('preview-image');
        expect(image.props.source).toEqual({ uri: 'https://example.com/image.jpg' });
    });

    // Test to ensure upload progress is displayed when uploading is true
    it('displays upload progress when uploading is true', () => {
        const props = {
            ...defaultProps,
            imageSource: 'https://example.com/image.jpg',
            uploading: true,
            uploadProgress: 50,
        };
        const { getByText } = render(<ImageUploadComponent {...props} />);
        const uploadText = getByText('Uploading: 50%');
        expect(uploadText).toBeTruthy();
    });

    // Test to ensure upload progress is not displayed when uploading is false
    it('does not display upload progress when uploading is false', () => {
        const props = {
            ...defaultProps,
            imageSource: 'https://example.com/image.jpg',
            uploading: false,
        };
        const { queryByText } = render(<ImageUploadComponent {...props} />);
        const uploadText = queryByText(/Uploading:/);
        expect(uploadText).toBeNull();
    });
});
