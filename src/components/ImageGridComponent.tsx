import React from 'react';
import { View, FlatList, TouchableOpacity, Image, StyleSheet, Text, Dimensions, ListRenderItem, Alert } from 'react-native';

import { Colors } from '../utilities/Constants';

interface ImageGridComponentProps {
    images: string[];
    handleDelete: (imageUrl: string) => void;
    handleHomePress: () => void;
    testID: string;
}

const ImageGridComponent: React.FC<ImageGridComponentProps> = ({ images, handleDelete, handleHomePress, testID }) => {
    const confirmDelete = (imageUrl: string) => {
        Alert.alert(
            "Confirm Delete",
            "Are you sure you want to delete this image?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => handleDelete(imageUrl)
                }
            ],
            { cancelable: true }
        );
    };

    const renderImage: ListRenderItem<string> = ({ item }) => (
        <TouchableOpacity onPress={() => confirmDelete(item)} style={styles.imageContainer} testID="image-item">
            <Image source={{ uri: item }} style={styles.image} />
        </TouchableOpacity>
    );

    return (
        <View style={styles.gridContainer} testID={testID}>
            <FlatList
                data={images}
                renderItem={renderImage}
                keyExtractor={(item, index) => index.toString()}
                numColumns={3}
                columnWrapperStyle={styles.columnWrapper}
            />
            <TouchableOpacity style={styles.button} onPress={handleHomePress} testID="home-button">
                <Text style={styles.buttonText}>Home</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    gridContainer: {
        flex: 1,
        margin: 5,
    },
    imageContainer: {
        margin: 5,
        borderRadius: 10,
        overflow: 'hidden',
        elevation: 5,
        width: (Dimensions.get('window').width - 40) / 3,
        height: (Dimensions.get('window').width - 40) / 3,
        backgroundColor: Colors.Background,
        shadowColor: Colors.Secondary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    columnWrapper: {
        justifyContent: 'space-between',
    },
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

export default ImageGridComponent;
