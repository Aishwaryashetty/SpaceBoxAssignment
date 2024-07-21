import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

import { Colors } from '../utilities/Constants';
import { CustomButtonComponentProps } from '../utilities/Interfaces';

const CustomButtonComponent: React.FC<CustomButtonComponentProps> = ({ onPress, title, testID }) => {
    return (
        <TouchableOpacity style={styles.button} onPress={onPress} testID={testID}>
            <Text style={styles.buttonText}>{title}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        backgroundColor: Colors.Secondary,
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 25,
        marginHorizontal: 10,
        marginVertical: 5,
        elevation: 3,
    },
    buttonText: {
        color: Colors.TextPrimary,
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default CustomButtonComponent;
