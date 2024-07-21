export interface ImageData {
    uri: string;
    thumbnail?: string;
    fileName: string;
    fileSize: number;
    type: string;
}

export interface CustomButtonComponentProps {
    onPress: () => void;
    title: string;
    testID: string;
}

export interface ButtonGroupComponentProps {
    handleRetake: () => void;
    handleUploadImage: () => void;
    fetchImages: () => void;
    showDummy: boolean;
    imagesLength: number;
    imageSource: ImageData[];
    uploading: boolean;
    testID: string;
}

export interface ImageUploadComponentProps {
    imageSource: ImageData[];
    testID: string;
}

export interface ImageListComponentProps {
    images: ImageData[];
    handleDelete: (images: ImageData[]) => void;
    handleHomePress: () => void;
    testID: string;
}

export interface ImagePickerComponentProps {
    setImageSource: (Images: ImageData[]) => void;
    setShowDummy: (show: boolean) => void;
    testID?: string;
}

export interface UploadProgressComponentProps {
    uploadProgress: number;
    currentImage: ImageData;
    remainingImages: number;
    testID: string;
}