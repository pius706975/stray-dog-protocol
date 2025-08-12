import React from 'react';
import { View, Text, Image, Modal } from 'react-native-ui-lib';
import { ShipPicturesAfterRentProps } from '../../../../types';
import {
    useSubmitShipPicturesAfterSailing,
    useSubmitShipPicturesBeforeSailing,
} from '../../../../hooks';
import ImagePicker, { ImageOrVideo } from 'react-native-image-crop-picker';
import { useDispatch } from 'react-redux';
import { modalSlice, progressIndicatorSlice } from '../../../../slices';
import mime from 'mime';
import { handleAxiosError } from '../../../../utils';
import { Button, ScreenLayout, TextInput } from '../../../../components';
import { FontFamily, FontSize, PlusIcon } from '../../../../configs';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { ConfirmationModal } from '../shipPictures/components';
import { useTranslation } from 'react-i18next';

const ShipPicturesAfterRent: React.FC<ShipPicturesAfterRentProps> = ({
    navigation,
    route,
}) => {
    const { transactionId, beforeSailingPictures } = route.params;
    const [selectedImages, setSelectedImages] = React.useState<ImageOrVideo[]>(
        [],
    );
    const { t } = useTranslation('saveship');
    const [descriptions, setDescriptions] = React.useState<string[]>([]);
    const dispatch = useDispatch();
    const { hideModal, showModal } = modalSlice.actions;
    const { hideProgressIndicator, showProgressIndicator } =
        progressIndicatorSlice.actions;
    const mutationSubmitShipPicturesAfterSailing =
        useSubmitShipPicturesAfterSailing();
    const [isConfirmationModalVisible, setConfirmationModalVisible] =
        React.useState(false);

    const placeholderImages = beforeSailingPictures
        ? Array(beforeSailingPictures.length).fill(null)
        : [];

    const openImage = (position: number) => {
        ImagePicker.openPicker({
            multiple: true,
            maxFiles: 10,
            width: 300,
            height: 400,
            cropping: true,
        })
            .then((images: ImageOrVideo[]) => {
                console.log('masuk');

                const updatedImages = [...selectedImages];
                const updatedDescriptions = [...descriptions];

                // Replace the images and descriptions at the specified position
                updatedImages[position] = images[0]; // Assuming the user can only select one image at a time
                updatedDescriptions[position] = '';

                setSelectedImages(updatedImages);
                setDescriptions(updatedDescriptions);
            })
            .catch(e => console.log(e));
    };

    const submitImages = async () => {
        console.log('Selected Images:', selectedImages);
        console.log('Descriptions:', descriptions);
        const formData = new FormData();
        dispatch(showProgressIndicator());
        formData.append('transactionId', transactionId);
        selectedImages.forEach((image, index) => {
            formData.append('files', {
                uri: image.path,
                type: mime.getType(image.path),
                name: `Image After ${
                    (beforeSailingPictures &&
                        beforeSailingPictures[index]?.description) ||
                    ''
                }`,
            });

            formData.append('descriptions', descriptions[index]);
        });

        console.log('formData', formData);

        mutationSubmitShipPicturesAfterSailing.mutate(formData, {
            onSuccess: () => {
                dispatch(hideProgressIndicator());
                dispatch(
                    showModal({
                        status: 'success',
                        text: 'Ship pictures after sailing submitted successfully',
                    }),
                );

                setTimeout(() => {
                    dispatch(hideModal());
                    navigation.goBack();
                }, 2000);
            },
            onError: err => {
                dispatch(hideProgressIndicator());
                handleAxiosError(err);
                dispatch(
                    showModal({
                        status: 'failed',
                        text: 'Error submitting ship pictures',
                    }),
                );

                setTimeout(() => {
                    dispatch(hideModal());
                }, 2000);
            },
        });
    };

    const isFormValid = () => {
        // Check if at least one image is selected
        if (selectedImages.length === 0) {
            return false;
        }

        // Check if all description fields have values

        // If both conditions are met, the form is considered valid
        return true;
    };

    const showConfirmationModal = () => {
        setConfirmationModalVisible(true);
    };

    const hideConfirmationModal = () => {
        setConfirmationModalVisible(false);
    };

    const confirmSubmit = () => {
        hideConfirmationModal();
        submitImages();
    };

    return (
        <ScreenLayout
            testId="ShipPicturesAfterRentScreen"
            backgroundColor="light"
            padding={10}
            gap={10}>
            <View
                style={{
                    padding: 10,
                }}>
                <Text
                    style={{
                        fontFamily: FontFamily.regular,
                        fontSize: FontSize.md,
                    }}>
                    {t('ShipPicturesAfterRent.PleaseSubmit')}
                </Text>
            </View>

            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                }}>
                {/* Left side - Display beforeSailingPictures */}
                <View style={{ flex: 1 }}>
                    <Text
                        style={{
                            fontFamily: FontFamily.regular,
                            fontSize: FontSize.md,
                            marginBottom: 10,
                            textAlign: 'center',
                        }}>
                        {t('ShipPicturesAfterRent.textBefore')}
                    </Text>
                    {beforeSailingPictures &&
                        beforeSailingPictures.map((image, index) => (
                            <View key={index} testID={`beforeSailing-${index}`}>
                                <Image
                                    source={{ uri: image.documentUrl }}
                                    style={{
                                        width: 150,
                                        height: 150,
                                        borderRadius: 100 / 2,
                                        marginBottom: 10,
                                        alignSelf: 'center',
                                    }}
                                />
                                {beforeSailingPictures &&
                                    beforeSailingPictures[index] && (
                                        <TextInput
                                            testId={`Desc-${index}`}
                                            placeholder="Description"
                                            value={
                                                beforeSailingPictures[index]
                                                    .description
                                            }
                                            editable={false}
                                        />
                                    )}
                            </View>
                        ))}
                </View>
                {/* // Right side - Select afterSailingPictures and provide descriptions */}
                <View style={{ flex: 1 }}>
                    <Text
                        style={{
                            fontFamily: FontFamily.regular,
                            fontSize: FontSize.md,
                            marginBottom: 10,
                            textAlign: 'center',
                        }}>
                        {t('ShipPicturesAfterRent.textAfter')}
                    </Text>
                    {placeholderImages.map((_, index) => (
                        <View key={index}>
                            <TouchableOpacity
                                testID="afterButton"
                                style={{
                                    width: 150,
                                    height: 150,
                                    borderRadius: 100 / 2,
                                    marginBottom: 10,
                                    alignSelf: 'center',
                                }}
                                onPress={() => openImage(index)}>
                                {/* Display selected image if available, otherwise display placeholder */}
                                {selectedImages[index] ? (
                                    <Image
                                        source={{
                                            uri: selectedImages[index].path,
                                        }}
                                        style={{
                                            width: 150,
                                            height: 150,
                                            borderRadius: 100 / 2,
                                            marginBottom: 10,
                                        }}
                                    />
                                ) : (
                                    <Image
                                        source={require('../../../../../assets/images/Empty.jpg')}
                                        style={{
                                            width: 150,
                                            height: 150,
                                            borderRadius: 100 / 2,
                                        }}
                                    />
                                )}
                            </TouchableOpacity>
                            {/* Display description for the selected image */}
                            {beforeSailingPictures &&
                                beforeSailingPictures[index] && (
                                    <TextInput
                                        testId={`desc-${index}`}
                                        placeholder="Description"
                                        value={
                                            beforeSailingPictures[index]
                                                .description
                                        }
                                        editable={false}
                                    />
                                )}
                        </View>
                    ))}
                </View>
            </View>

            <Button
                testID="submitButton"
                title={t('ShipPicturesAfterRent.Submit')}
                onSubmit={showConfirmationModal}
                disable={!isFormValid()}
            />

            <ConfirmationModal
                isVisible={isConfirmationModalVisible}
                onConfirm={confirmSubmit}
                onCancel={hideConfirmationModal}
            />
        </ScreenLayout>
    );
};

export default ShipPicturesAfterRent;
