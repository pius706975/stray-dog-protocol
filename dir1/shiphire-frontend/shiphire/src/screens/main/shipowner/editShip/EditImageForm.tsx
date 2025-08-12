import mime from 'mime';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text, TouchableOpacity } from 'react-native';
import ImagePicker, { ImageOrVideo } from 'react-native-image-crop-picker';
import { View } from 'react-native-ui-lib';
import { useDispatch, useSelector } from 'react-redux';
import { Button, ScreenLayout } from '../../../../components';
import {
    ArrowIcon,
    CloseIcon,
    Color,
    FontFamily,
    FontSize,
    PlusIcon,
} from '../../../../configs';
import { useEditShipImage } from '../../../../hooks';
import { modalSlice, progressIndicatorSlice } from '../../../../slices';
import { EditImageFormProps, RootState } from '../../../../types';

const EditImageForm: React.FC<EditImageFormProps> = ({ navigation, route }) => {
    // const shipData = useSelector((state: RootState) => state.addShip);
    const { shipId, shipName } = route.params;
    const { t } = useTranslation('detailship');
    const [selectedImage, setSelectedImage] = React.useState<ImageOrVideo>();
    const [showDeleteBusinessButton, setShowDeleteBusinessButton] =
        React.useState(false);
    const mutationEditShipImage = useEditShipImage();
    const dispatch = useDispatch();
    const { showModal, hideModal } = modalSlice.actions;
    const { showProgressIndicator, hideProgressIndicator } =
        progressIndicatorSlice.actions;
    const request = new FormData();

    const openImage = () => {
        ImagePicker.openPicker({
            width: 300,
            height: 400,
            cropping: true,
        })
            .then(image => {
                setSelectedImage(image);
            })
            .catch(e => console.log(e));
    };

    const handleSubmit = () => {
        dispatch(showProgressIndicator());

        if (selectedImage?.path === undefined) {
            dispatch(hideProgressIndicator());
            dispatch(
                showModal({
                    status: 'failed',
                    text: t('ShipOwner.EditImageForm.labelMustSelect'),
                }),
            );
            setTimeout(() => {
                dispatch(hideModal());
            }, 2000);
        } else if (selectedImage) {
            console.log(selectedImage?.path);

            request.append('image', {
                uri: selectedImage?.path,
                type: mime.getType(selectedImage?.path),
                name: `Image Ship ${shipName}`,
            });
            mutationEditShipImage.mutate(
                { request, shipId },
                {
                    onSuccess: () => {
                        dispatch(hideProgressIndicator());
                        dispatch(
                            showModal({
                                status: 'success',
                                text: t(
                                    'ShipOwner.EditImageForm.successShipImageEdited',
                                ),
                            }),
                        );
                        setTimeout(() => {
                            dispatch(hideModal());
                        }, 2000);

                        navigation.navigate('OwnerDetailShip', { shipId });
                    },
                    onError: () => {
                        dispatch(hideProgressIndicator());
                        dispatch(
                            showModal({
                                status: 'failed',
                                text: t(
                                    'ShipOwner.EditImageForm.failedEditShipImage',
                                ),
                            }),
                        );
                        setTimeout(() => {
                            dispatch(hideModal());
                        }, 2000);
                    },
                },
            );
        }
    };

    return (
        <ScreenLayout backgroundColor={'light'} testId={'imageFormAddShip'}>
            <View marginH-20 marginV-26>
                <View>
                    <View
                        style={{
                            paddingBottom: 5,
                        }}>
                        <Text
                            style={{
                                fontFamily: FontFamily.medium,
                                fontSize: FontSize.xl,
                                color: Color.primaryColor,
                            }}>
                            {t('ShipOwner.EditImageForm.textChooseImage')}
                        </Text>
                    </View>
                    <View
                        style={{
                            paddingBottom: 25,
                        }}>
                        {selectedImage ? (
                            <View
                                testID="selectedImage"
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    borderBottomWidth: 1,
                                    borderBottomColor: Color.primaryColor,
                                    paddingBottom: 15,
                                }}>
                                <Text
                                    style={{
                                        flex: 1,
                                        color: Color.darkTextColor,
                                    }}>
                                    {selectedImage.path.split('/').pop()}
                                </Text>
                                {showDeleteBusinessButton && (
                                    <TouchableOpacity
                                        onPress={() => {
                                            setSelectedImage(undefined);
                                            setShowDeleteBusinessButton(false);
                                        }}>
                                        <CloseIcon />
                                    </TouchableOpacity>
                                )}
                            </View>
                        ) : (
                            <TouchableOpacity
                                testID="selectImageButton"
                                onPress={openImage}>
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        borderBottomWidth: 1,
                                        borderBottomColor: Color.primaryColor,
                                        paddingBottom: 15,
                                    }}>
                                    <Text style={{ flex: 1 }}>
                                        {t(
                                            'ShipOwner.EditImageForm.textSelectFile',
                                        )}
                                    </Text>
                                    <PlusIcon />
                                </View>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
                <View
                    style={{
                        flex: 1,
                        justifyContent: 'flex-end',
                    }}>
                    <Button
                        testID="submitButton"
                        rightIcon={<ArrowIcon />}
                        title={t('ShipOwner.EditImageForm.labelButtonNext')}
                        onSubmit={() => handleSubmit()}
                    />
                </View>
            </View>
        </ScreenLayout>
    );
};

export default EditImageForm;
