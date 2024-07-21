import React from 'react';
import { View, FlatList, Image, StyleSheet } from 'react-native';

import { ImageData, ImageUploadComponentProps } from '../utilities/Interfaces';

const ImageComponent: React.FC<ImageUploadComponentProps> = ({
    imageSource,
    testID
}) => {

    const renderItem = ({ item }: { item: ImageData }) => (

        <View style={styles.previewWrapper} >
            <Image
                style={styles.previewImage}
                source={{ uri: item?.uri }}
                testID="preview-image"
            />
        </View >
    );

    return (
        <View style={styles.container} testID={testID}>
            {imageSource?.length <= 0 ? (
                <View style={styles.dummyWrapper}>
                    <Image
                        style={styles.dummyPreview}
                        source={require('../assets/images/waiting.png')}
                        testID="preview-image"
                    />
                </View>
            ) : (
                <FlatList
                    data={imageSource}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.uri}
                    numColumns={3}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
    },
    previewWrapper: {
        position: 'relative',
        marginBottom: 20,
        width: 100,
        height: 100,
    },
    dummyWrapper: {
        position: 'relative',
        marginBottom: 20,
        width: '100%',
        height: 300,
        alignItems: 'center',
    },
    dummyPreview: {
        height: '100%',
        resizeMode: 'contain'
    },
    previewImage: {
        height: '100%',
        borderRadius: 10,
        margin: 5
    },
});

export default ImageComponent;
