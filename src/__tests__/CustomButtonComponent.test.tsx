import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';

import CustomButtonComponent from '../components/CustomButtonComponent';

import { Colors } from '../utilities/Constants';

// Test suite for CustomButtonComponent
describe('CustomButtonComponent', () => {
    // Mock function for the onPress handler
    const mockOnPress = jest.fn();

    // Default props to be used in the tests
    const defaultProps = {
        onPress: mockOnPress,
        title: 'Press Me',
        testID: 'custom-button',
    };

    // Test to ensure the component renders correctly with the given title
    it('renders correctly with given title', () => {
        const { getByText } = render(<CustomButtonComponent {...defaultProps} />);
        const buttonText = getByText('Press Me');
        expect(buttonText).toBeTruthy();
    });

    // Test to ensure the onPress function is called when the button is pressed
    it('calls onPress function when pressed', () => {
        const { getByTestId } = render(<CustomButtonComponent {...defaultProps} />);
        const button = getByTestId('custom-button');
        fireEvent.press(button);
        expect(mockOnPress).toHaveBeenCalled();
    });

    // Test to ensure the correct styles are applied to the button
    it('applies correct styles', () => {
        const { getByTestId } = render(<CustomButtonComponent {...defaultProps} />);
        const button = getByTestId('custom-button');
        const { backgroundColor, paddingVertical, paddingHorizontal, borderRadius, elevation } = button.props.style;
        expect(backgroundColor).toBe(Colors.Secondary);
        expect(paddingVertical).toBe(15);
        expect(paddingHorizontal).toBe(30);
        expect(borderRadius).toBe(25);
        expect(elevation).toBe(3);
    });

    // Test to ensure the correct text color and style are applied to the button's title
    it('displays the correct text color and style', () => {
        const { getByText } = render(<CustomButtonComponent {...defaultProps} />);
        const buttonText = getByText('Press Me');
        const { color, fontSize, fontWeight, textAlign } = buttonText.props.style;
        expect(color).toBe(Colors.TextPrimary);
        expect(fontSize).toBe(16);
        expect(fontWeight).toBe('bold');
        expect(textAlign).toBe('center');
    });
});
