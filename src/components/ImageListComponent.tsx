import React, { useState } from 'react';
import { View, FlatList, TouchableOpacity, StyleSheet, Text, Dimensions, ListRenderItem, Image, Modal } from 'react-native';

import { Colors } from '../utilities/Constants';
import { showAlert } from '../utilities/CommonFunctions';
import { ImageData, ImageListComponentProps } from '../utilities/Interfaces';

import CustomButtonComponent from './CustomButtonComponent';



const ImageListComponent: React.FC<ImageListComponentProps> = ({ images, handleDelete, handleHomePress, testID }) => {
    const [selectedImages, setSelectedImages] = useState<ImageData[]>([]);
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [currentImage, setCurrentImage] = useState<ImageData | null>(null);

    const toggleSelectImage = (image: ImageData) => {
        if (selectedImages.includes(image)) {
            setSelectedImages(selectedImages.filter(selectedImage => selectedImage !== image));
        } else {
            setSelectedImages([...selectedImages, image]);
        }
    };

    const openModal = (image: ImageData) => {
        setCurrentImage(image);
        setModalVisible(true);
    };

    const closeModal = () => {
        setCurrentImage(null);
        setModalVisible(false);
    };


    const confirmDelete = () => {
        showAlert(
            "Confirm Delete",
            `Are you sure you want to delete the selected [${selectedImages.length}] images?`,
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => {
                        handleDelete(selectedImages);
                        setSelectedImages([]);
                    }
                }
            ],
            { cancelable: true }
        );
    };

    const renderImage: ListRenderItem<ImageData> = ({ item }) => (
        <TouchableOpacity style={styles.container} onPress={() => toggleSelectImage(item)}>
            {selectedImages.includes(item) && <View style={styles.overlay} />}
            <TouchableOpacity onPress={() => openModal(item)} style={styles.imageContainer} testID="image-item">
                <Image source={{ uri: item.thumbnail }} style={styles.image} />
            </TouchableOpacity>
            <View style={{ flexDirection: 'row', flex: 1 }}>
                <View style={{ margin: 5, flex: 1, justifyContent: 'center' }}>
                    <View style={styles.textRow}>
                        <Text style={styles.textStyle}>Name :</Text>
                        <Text style={styles.textStyle}>{item.fileName}</Text>
                    </View>
                    <View style={styles.textRow}>
                        <Text style={styles.textStyle}>Size :</Text>
                        <Text style={styles.textStyle}>{item.fileSize} KB</Text>
                    </View>
                    <View style={styles.textRow}>
                        <Text style={styles.textStyle}>Type :</Text>
                        <Text style={styles.textStyle}>{item.type}</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.gridContainer} testID={testID}>
            <FlatList
                data={images}
                renderItem={renderImage}
                keyExtractor={(item, index) => index.toString()}
                numColumns={1}
            />
            <CustomButtonComponent onPress={confirmDelete} title="Delete Selected" testID="delete-button" />
            <CustomButtonComponent onPress={handleHomePress} title="Home" testID="home-button" />

            {currentImage && (
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={closeModal}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Image source={{ uri: currentImage.uri }} style={styles.modalImage} />
                            <View style={styles.modalTextContainer}>
                                <View style={styles.textRow}>
                                    <Text style={styles.textStyle}>Name :</Text>
                                    <Text style={styles.textStyle}>{currentImage.fileName}</Text>
                                </View>
                                <View style={styles.textRow}>
                                    <Text style={styles.textStyle}>Size :</Text>
                                    <Text style={styles.textStyle}>{currentImage.fileSize} KB</Text>
                                </View>
                                <View style={styles.textRow}>
                                    <Text style={styles.textStyle}>Type :</Text>
                                    <Text style={styles.textStyle}>{currentImage.type}</Text>
                                </View>
                            </View>
                            <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                                <Text style={styles.closeButtonText}>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    gridContainer: {
        flex: 1,
        margin: 5,
    },
    container: {
        backgroundColor: Colors.Accent,
        margin: 5,
        padding: 5,
        borderRadius: 10,
        flexDirection: 'row',
    },
    reloadIconContainer: {
        backgroundColor: Colors.Highlight,
        position: 'absolute',
        top: 10,
    },
    IconContainer: {
        position: 'absolute',
        right: 10,
        zIndex: 1,
        padding: 5,
        borderRadius: 15,
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
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
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
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: 10,
    },
    textStyle: {
        color: Colors.TextSecondary,
        fontWeight: 'bold',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        padding: 5,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        padding: 20,
        backgroundColor: Colors.Background,
        borderRadius: 10,
        alignItems: 'center',
    },
    modalImage: {
        width: '100%',
        height: Dimensions.get('window').width * 0.8,
        marginBottom: 20,
    },
    closeButton: {
        backgroundColor: Colors.Secondary,
        padding: 10,
        margin: 5,
        borderRadius: 5,
    },
    closeButtonText: {
        color: Colors.TextPrimary,
        fontSize: 16,
        fontWeight: 'bold',
    },
    modalTextContainer: {
        width: '100%',
        marginBottom: 20,
    },
    textRow: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginBottom: 5,
        flexWrap: 'wrap',

    },
});

export default ImageListComponent;
