import React, { useState, useCallback, useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { View, TouchableOpacity, Image } from 'react-native-ui-lib';
import ImagePicker, { ImageOrVideo } from 'react-native-image-crop-picker';
import { useTranslation } from 'react-i18next';
import { Button, CustomText, TextInput } from '../../../../../components';
import { DeleteIcon } from '../../../../../configs';
import { ImageInputProps } from '../../../../../types';

const ImageInput: React.FC<ImageInputProps> = ({
    values,
    setFieldValue,
    touched,
    errors,
}) => {
    const [selectedImages, setSelectedImages] = useState<ImageOrVideo[]>(
        values.images || [],
    );
    const [descriptions, setDescriptions] = useState<string[]>(
        values.descriptions || [],
    );

    const { t } = useTranslation('shiptracking');

    const openImagePicker = useCallback(
        (indexToUpdate: number | null = null) => {
            ImagePicker.openPicker({
                multiple: true,
                maxFiles: 10,
                width: 300,
                height: 400,
                cropping: true,
            })
                .then((images: ImageOrVideo[]) => {
                    let updatedImages = [...selectedImages];
                    let updatedDescriptions = [...descriptions];
                    if (
                        indexToUpdate !== null &&
                        indexToUpdate < selectedImages.length
                    ) {
                        updatedImages[indexToUpdate] = images[0];
                        updatedDescriptions[indexToUpdate] = '';
                    } else {
                        updatedImages = [...selectedImages, ...images];
                        updatedDescriptions = [
                            ...descriptions,
                            ...images.map(() => ''),
                        ];
                    }
                    setSelectedImages(updatedImages);
                    setDescriptions(updatedDescriptions);
                    setFieldValue('images', updatedImages);
                    setFieldValue('descriptions', updatedDescriptions);
                })
                .catch(e => {});
        },
        [selectedImages, descriptions, setFieldValue],
    );

    const handleDescriptionChange = useCallback(
        (index: number, text: string) => {
            setDescriptions(prevDescriptions => {
                const updatedDescriptions = [...prevDescriptions];
                updatedDescriptions[index] = text;
                setFieldValue('descriptions', updatedDescriptions);
                return updatedDescriptions;
            });
        },
        [setFieldValue],
    );

    const removeImage = useCallback(
        (index: number) => {
            const updatedImages = selectedImages.filter((_, i) => i !== index);
            const updatedDescriptions = descriptions.filter(
                (_, i) => i !== index,
            );
            setSelectedImages(updatedImages);
            setDescriptions(updatedDescriptions);
            setFieldValue('images', updatedImages);
            setFieldValue('descriptions', updatedDescriptions);
        },
        [selectedImages, descriptions, setFieldValue],
    );

    const renderedImages = useMemo(() => {
        return selectedImages.map((image, index) => (
            <View
                testID={`SelectedImage-${index}`}
                key={index}
                style={styles.imageContainer}>
                <TextInput
                    label={`${t('ImageInput.textImage')} ${index + 1}`}
                    placeholder={t('ImageInput.textImageCaption')}
                    value={descriptions[index]}
                    onChange={text => handleDescriptionChange(index, text)}
                    rightIcon={<DeleteIcon />}
                    onIconTouch={() => removeImage(index)}
                    error={
                        touched.descriptions &&
                        errors.descriptions &&
                        errors.descriptions[index]
                    }
                />
                <TouchableOpacity
                    style={styles.imageTouchable}
                    onPress={() => openImagePicker(index)}>
                    <Image source={{ uri: image.path }} style={styles.image} />
                </TouchableOpacity>
            </View>
        ));
    }, [
        selectedImages,
        descriptions,
        handleDescriptionChange,
        removeImage,
        openImagePicker,
        t,
        touched,
        errors,
    ]);

    return (
        <View>
            <View style={styles.headerContainer}>
                <View style={styles.headerTextContainer}>
                    <CustomText
                        color="primaryColor"
                        fontSize="xl"
                        fontFamily="medium">
                        {t('ImageInput.textAttachImage')}
                    </CustomText>
                </View>
                <View style={styles.addButtonContainer}>
                    <Button
                        testID="SubmitBtn"
                        title={t('ImageInput.textAddImage')}
                        onSubmit={() => openImagePicker()}
                    />
                </View>
            </View>
            <View style={styles.imagesContainer}>{renderedImages}</View>
        </View>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        paddingLeft: 10,
        paddingBottom: 25,
    },
    headerTextContainer: {
        paddingBottom: 15,
    },
    addButtonContainer: {
        width: '50%',
    },
    imagesContainer: {
        flex: 1,
    },
    imageContainer: {
        marginBottom: 15,
    },
    imageTouchable: {
        paddingHorizontal: 15,
    },
    image: {
        width: '100%',
        maxHeight: 200,
        aspectRatio: 2,
        borderRadius: 10,
    },
});

export default ImageInput;
