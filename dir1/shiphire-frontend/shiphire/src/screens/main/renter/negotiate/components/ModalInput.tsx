import React from 'react';
import { Modal, View } from 'react-native-ui-lib';

import { Pressable } from 'react-native';

import { useTranslation } from 'react-i18next';
import { CloseIcon, Color, PlusIcon } from '../../../../../configs';
import {
    CustomText,
    TextInput,
    TextInputError,
} from '../../../../../components';
import CustomButton from '../../../../../components/Button';
import ImagePicker, { ImageOrVideo } from 'react-native-image-crop-picker';

const ModalInput = ({
    visible,
    onClose,
    additionalImageList,
    setAdditionalImageList,
}) => {
    const { t } = useTranslation('common');
    const [selectedImage, setSelectedImage] =
        React.useState<ImageOrVideo | null>(null);
    const [showDeleteButton, setShowDeleteButton] =
        React.useState<boolean>(false);
    const [imageDesc, setImageDesc] = React.useState('');
    const [error, setError] = React.useState({ name: false, image: false });
    const openImage = () => {
        ImagePicker.openPicker({
            width: 1400,
            height: 2000,
            cropping: true,
        })
            .then(image => {
                setSelectedImage(image);
                setShowDeleteButton(true);
            })
            .catch(e => console.log(e));
    };

    const handleAddImage = () => {
        if (imageDesc !== '' && selectedImage) {
            setError({ name: false, image: false });
            setAdditionalImageList([
                ...additionalImageList,
                {
                    id: Date.now(),
                    selectedImage: selectedImage,
                    imageNotes: imageDesc,
                },
            ]);
            setImageDesc('');
            setSelectedImage(null);
            onClose();
        } else {
            setError({ name: true, image: true });
        }
    };
    return (
        <Modal
            testID="modalInputId"
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}>
            <View
                flex-1
                style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(0,0,0,0.7)',
                }}>
                <View
                    style={{
                        backgroundColor: Color.bgColor,
                        padding: 16,
                        borderRadius: 8,
                        width: '83%',
                    }}>
                    <View
                        style={{
                            paddingTop: 20,
                            margin: -10,
                        }}>
                        <TextInput
                            leftIcon
                            placeholder={t(
                                'FormNegotiateRenter.NegotiateForm.placeholderImageCaption',
                            )}
                            label={t(
                                'FormNegotiateRenter.NegotiateForm.labelimageCaption',
                            )}
                            onChange={e => setImageDesc(e)}
                            value={imageDesc}
                        />
                        {imageDesc === '' && error.name && (
                            <TextInputError
                                errorText={t(
                                    'FormNegotiateRenter.NegotiateForm.validationimageCaption',
                                )}
                            />
                        )}
                    </View>
                    <View
                        style={{
                            paddingTop: 20,
                        }}>
                        <View paddingB-25>
                            <CustomText
                                color="primaryColor"
                                fontSize="xl"
                                fontFamily="medium">
                                {t(
                                    'FormNegotiateRenter.NegotiateForm.textUploadImage',
                                )}
                            </CustomText>
                        </View>
                        <View paddingB-15>
                            {selectedImage ? (
                                <View
                                    row
                                    centerV
                                    paddingB-15
                                    style={{
                                        borderBottomWidth: 1,
                                        borderBottomColor: error.image
                                            ? Color.errorColor
                                            : Color.primaryColor,
                                        justifyContent: 'space-between',
                                    }}>
                                    <View
                                        style={{
                                            flexWrap: 'nowrap',
                                            width: '90%',
                                        }}>
                                        <CustomText
                                            color="darkTextColor"
                                            fontFamily="regular"
                                            fontSize="sm">
                                            {selectedImage?.path
                                                .split('/')
                                                .pop()}
                                        </CustomText>
                                    </View>
                                    {showDeleteButton && (
                                        <Pressable
                                            testID="buttonDelete"
                                            onPress={() => {
                                                setSelectedImage(null);
                                                setShowDeleteButton(false);
                                            }}>
                                            <CloseIcon />
                                        </Pressable>
                                    )}
                                </View>
                            ) : (
                                <Pressable
                                    onPress={openImage}
                                    testID="buttonImage">
                                    <View
                                        row
                                        centerV
                                        paddingB-15
                                        style={{
                                            borderBottomWidth: 1,
                                            borderBottomColor: error.image
                                                ? Color.errorColor
                                                : Color.primaryColor,
                                            justifyContent: 'space-between',
                                        }}>
                                        <CustomText
                                            color="darkTextColor"
                                            fontFamily="regular"
                                            fontSize="md">
                                            {t(
                                                'FormNegotiateRenter.NegotiateForm.textSelectImage',
                                            )}
                                        </CustomText>
                                        <PlusIcon />
                                    </View>
                                </Pressable>
                            )}
                        </View>
                        {selectedImage === null && error.image && (
                            <View
                                marginT-10
                                style={{
                                    marginLeft: -10,
                                }}>
                                <TextInputError
                                    errorText={'Image is required'}
                                />
                            </View>
                        )}
                    </View>
                    <View row style={{ justifyContent: 'center' }}>
                        <View
                            style={{
                                marginTop: 15,
                                marginRight: 15,
                            }}>
                            <CustomButton
                                title={t(
                                    'FormProposalOwner.AdditionalDocument.textCancel',
                                )}
                                onSubmit={onClose}
                                color="error"
                            />
                        </View>
                        <View
                            style={{
                                marginTop: 15,
                            }}>
                            <CustomButton
                                testID="buttonAddImage"
                                title={t(
                                    'FormNegotiateRenter.NegotiateForm.textAddImage',
                                )}
                                onSubmit={handleAddImage}
                            />
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default ModalInput;
