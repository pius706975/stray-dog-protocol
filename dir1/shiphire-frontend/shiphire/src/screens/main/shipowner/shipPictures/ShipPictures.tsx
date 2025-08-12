import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native-ui-lib';
import { ShipPictureProps } from '../../../../types';
import {
    Button,
    CustomText,
    ScreenLayout,
    TextInput,
} from '../../../../components';
import { FontFamily, FontSize, PlusIcon } from '../../../../configs';
import ImagePicker, { ImageOrVideo } from 'react-native-image-crop-picker';
import mime from 'mime';
import { useDispatch } from 'react-redux';
import { useSubmitShipPicturesBeforeSailing } from '../../../../hooks';
import { modalSlice, progressIndicatorSlice } from '../../../../slices';
import { handleAxiosError } from '../../../../utils';
import { ConfirmationModal } from './components';
import { useTranslation } from 'react-i18next';

const ShipPictures: React.FC<ShipPictureProps> = ({ navigation, route }) => {
    const {
        transactionId,
        sailingStatus,
        beforeSailingPictures,
        afterSailingPictures,
    } = route.params;
    const [selectedImages, setSelectedImages] = React.useState<ImageOrVideo[]>(
        [],
    );
    const [descriptions, setDescriptions] = React.useState<string[]>([]);
    const dispatch = useDispatch();
    const { hideModal, showModal } = modalSlice.actions;
    const { hideProgressIndicator, showProgressIndicator } =
        progressIndicatorSlice.actions;
    const mutationSubmitShipPicturesBeforeSailing =
        useSubmitShipPicturesBeforeSailing();
    const [isConfirmationModalVisible, setConfirmationModalVisible] =
        React.useState(false);
    const { t } = useTranslation('saveship');

    const openImage = (indexToUpdate: number | null = null) => {
        ImagePicker.openPicker({
            multiple: true,
            maxFiles: 10,
            width: 300,
            height: 400,
            cropping: true,
        })
            .then((images: ImageOrVideo[]) => {
                console.log('Images:', images);
                if (
                    indexToUpdate !== null &&
                    indexToUpdate < selectedImages.length
                ) {
                    const updatedImages = [...selectedImages];
                    updatedImages[indexToUpdate] = images[0]; // Only update the selected index
                    setSelectedImages(updatedImages);
                    const updatedDescriptions = [...descriptions];
                    updatedDescriptions[indexToUpdate] = ''; // Reset description if needed
                    setDescriptions(updatedDescriptions);
                } else {
                    console.log('Selected Images:', images);
                    setSelectedImages(images);
                    setDescriptions(Array(images.length).fill(''));
                    console.log('Descriptions:', descriptions);
                }
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
                name: `Image Before ${descriptions[index]}`,
            });

            formData.append('descriptions', descriptions[index]);
        });

        mutationSubmitShipPicturesBeforeSailing.mutate(formData, {
            onSuccess: () => {
                dispatch(hideProgressIndicator());
                dispatch(
                    showModal({
                        status: 'success',
                        text: t('ShipPictures.textSuccessUpload'),
                    }),
                );

                setTimeout(() => {
                    dispatch(hideModal());
                    navigation.navigate('OwnerTransactionTabNav');
                }, 2000);
            },
            onError: err => {
                dispatch(hideProgressIndicator());
                handleAxiosError(err);
                dispatch(
                    showModal({
                        status: 'failed',
                        text: t('ShipPictures.textFailedUpload'),
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
        for (const description of descriptions) {
            if (!description.trim()) {
                return false;
            }
        }

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

    const renderSubmittedImages = () => {
        if (
            beforeSailingPictures &&
            Array.isArray(beforeSailingPictures) &&
            beforeSailingPictures.length > 0
        ) {
            return beforeSailingPictures.map((image, index) => (
                <View key={index} style={{ alignSelf: 'center' }}>
                    <Image
                        source={{ uri: image.documentUrl }}
                        style={{
                            width: 150,
                            height: 150,
                            borderRadius: 100 / 2,
                            marginBottom: 10,
                        }}
                    />
                    <Text style={{ textAlign: 'center', marginBottom: 20 }}>
                        {image.description
                            ? image.description
                            : 'No description'}
                    </Text>
                </View>
            ));
        }
        return null;
    };
    return (
        <ScreenLayout
            testId="ShipPicturesScreen"
            backgroundColor="light"
            padding={10}
            gap={10}>
            {beforeSailingPictures?.length &&
            beforeSailingPictures.length > 0 ? (
                <View
                    style={{
                        padding: 10,
                    }}>
                    <Text
                        style={{
                            fontFamily: FontFamily.regular,
                            fontSize: FontSize.md,
                        }}>
                        {t('ShipPictures.PreviouslySubmitted')}
                    </Text>
                    <View
                        style={{
                            padding: 10,
                        }}>
                        {renderSubmittedImages()}
                    </View>
                </View>
            ) : null}
            <View
                style={{
                    padding: 10,
                }}>
                <Text
                    style={{
                        fontFamily: FontFamily.regular,
                        fontSize: FontSize.md,
                    }}>
                    {t('ShipPictures.PleaseSubmit')}
                </Text>
            </View>

            <View style={{ flex: 1 }}>
                <View>
                    {selectedImages.length > 0 ? (
                        selectedImages.map((image, index) => (
                            <View testID={`SelectedImage-${index}`} key={index}>
                                <TouchableOpacity
                                    style={{
                                        marginTop: 20,
                                        width: 150,
                                        height: 150,
                                        borderRadius: 100 / 2,
                                        alignSelf: 'center',
                                    }}
                                    onPress={() => openImage(index)}>
                                    <Image
                                        source={{ uri: image.path }}
                                        style={{
                                            width: 150,
                                            height: 150,
                                            borderRadius: 100 / 2,
                                            marginBottom: 10,
                                        }}
                                    />
                                </TouchableOpacity>
                                {/* Input field for descriptions */}
                                <TextInput
                                    // placeholder={t(`ShipPictures.textDescription.${index + 1}`)}
                                    placeholder={t(`ShipPictures.textDescription`)}
                                    value={descriptions[index]}
                                    onChange={text => {
                                        const updatedDescriptions = [
                                            ...descriptions,
                                        ];
                                        updatedDescriptions[index] = text;
                                        setDescriptions(updatedDescriptions);
                                        console.log('Index', index + 1);
                                        console.log(
                                            'Descriptions:',
                                            descriptions,
                                        );
                                    }}
                                />
                            </View>
                        ))
                    ) : (
                        <TouchableOpacity
                            testID="AddImageBtn"
                            style={{
                                marginTop: 20,
                                width: 150,
                                height: 150,
                                borderRadius: 100 / 2,
                                alignSelf: 'center',
                            }}
                            onPress={openImage}>
                            <Image
                                source={require('../../../../../assets/images/Empty.jpg')}
                                style={{
                                    width: 150,
                                    height: 150,
                                    borderRadius: 100 / 2,
                                }}
                            />
                            <View
                                style={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: [
                                        { translateX: -15 },
                                        { translateY: -15 },
                                    ],
                                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                                    width: 30,
                                    height: 30,
                                    borderRadius: 15,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                <PlusIcon />
                            </View>
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            <Button
                testID="SubmitBtn"
                title={t('ShipPictures.Submit')}
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

export default ShipPictures;
