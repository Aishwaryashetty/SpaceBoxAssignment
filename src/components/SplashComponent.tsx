import React, { useEffect } from 'react';
import { View, StyleSheet, Image, Text } from 'react-native';

const SplashComponent: React.FC<{ onTimeout: () => void }> = ({ onTimeout }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onTimeout();
        }, 3000);

        return () => clearTimeout(timer);
    }, [onTimeout]);

    return (
        <View style={styles.container}>
            <Image style={styles.loadingGif} source={require('../assets/gifs/loading3.gif')} />
            <Text style={styles.text}>SpaceBox Assignment</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
    },
    loadingGif: {
        width: 300,
        height: 300,
    },
    text: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 30

    },
});

export default SplashComponent;
