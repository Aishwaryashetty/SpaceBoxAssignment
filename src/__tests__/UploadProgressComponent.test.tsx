import React from 'react';
import { render } from '@testing-library/react-native';

import UploadProgressComponent from '../components/UploadProgressComponent';

// Test suite for UploadProgressComponent
describe('UploadProgressComponent', () => {

    // Test to ensure the component renders without crashing
    it('renders without crashing', () => {
        const { getByTestId } = render(
            <UploadProgressComponent
                testID="upload-progress-component"
                uploadProgress={50}
                imageSource="https://example.com/image.jpg"
            />
        );
        const component = getByTestId('upload-progress-component');
        expect(component).toBeTruthy();
    });

    // Test to ensure the correct upload progress is displayed
    it('displays the correct upload progress', () => {
        const { getByText } = render(
            <UploadProgressComponent
                testID="upload-progress-component"
                uploadProgress={75}
                imageSource="https://example.com/image.jpg"
            />
        );
        const progressText = getByText('Uploading: 75%');
        expect(progressText).toBeTruthy();
    });

    // Test to ensure the image is rendered correctly
    it('renders the image correctly', () => {
        const { getByTestId } = render(
            <UploadProgressComponent
                testID="upload-progress-component"
                uploadProgress={50}
                imageSource="https://example.com/image.jpg"
            />
        );
        const image = getByTestId('upload-image-preview');
        expect(image.props.source.uri).toBe('https://example.com/image.jpg');
    });
});
