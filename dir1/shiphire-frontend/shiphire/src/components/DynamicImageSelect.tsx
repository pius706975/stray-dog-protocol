import { FormikErrors } from 'formik';
import React from 'react';
import { Pressable } from 'react-native';
import ImagePicker, { ImageOrVideo } from 'react-native-image-crop-picker';
import { View } from 'react-native-ui-lib';
import { CloseIcon, Color, PlusIcon } from '../configs';
import CustomText from './CustomText';
import TextInputError from './TextInputError';
import { useTranslation } from 'react-i18next';

const DynamicImageSelect: React.FC<{
    testID: string;
    label: string;
    error?:
        | string
        | false
        | string[]
        | FormikErrors<any>
        | FormikErrors<any>[]
        | boolean
        | Date;
    errorText?: string;
    setSelectedValue: (e: ImageOrVideo) => void;
    setUnselectValue: () => void;
}> = ({
    testID,
    label,
    error,
    errorText,
    setSelectedValue,
    setUnselectValue,
}) => {
    const [selectedImage, setSelectedImage] = React.useState<ImageOrVideo>();
    const [showDeleteButton, setShowDeleteButton] =
        React.useState<boolean>(false);

    const openImage = () => {
        ImagePicker.openPicker({
            width: 1400,
            height: 1000,
            cropping: true,
        })
            .then(image => {
                setSelectedImage(image);
                setSelectedValue(image);
            })
            .catch(e => console.log(e));
    };
    const { t } = useTranslation('detailship')

    return (
        <View>
            <View paddingB-5>
                <CustomText
                    color="primaryColor"
                    fontSize="xl"
                    fontFamily="medium">
                    {label}
                </CustomText>
            </View>
            <View paddingB-25>
                {selectedImage ? (
                    <View
                        flex
                        spread
                        row
                        centerV
                        paddingB-15
                        style={{
                            borderBottomWidth: 1,
                            borderBottomColor: error
                                ? Color.errorColor
                                : Color.primaryColor,
                        }}>
                        <CustomText
                            color="darkTextColor"
                            fontFamily="regular"
                            fontSize="md">
                            {selectedImage?.path.split('/').pop()}
                        </CustomText>
                        {showDeleteButton && (
                            <Pressable
                                onPress={() => {
                                    setSelectedImage(undefined);
                                    setShowDeleteButton(false);
                                    setUnselectValue();
                                }}>
                                <CloseIcon />
                            </Pressable>
                        )}
                    </View>
                ) : (
                    <Pressable testID={testID} onPress={openImage}>
                        <View
                            flex
                            spread
                            row
                            centerV
                            paddingB-15
                            style={{
                                borderBottomWidth: 1,
                                borderBottomColor: error
                                    ? Color.errorColor
                                    : Color.primaryColor,
                            }}>
                            <CustomText
                                color="darkTextColor"
                                fontFamily="regular"
                                fontSize="md">
                                {t('ShipOwner.AddShip.textSelect')}
                            </CustomText>
                            <PlusIcon />
                        </View>
                    </Pressable>
                )}
            </View>
            {error && (
                <View
                    style={{
                        marginLeft: -10,
                    }}>
                    <TextInputError errorText={errorText ? errorText : ''} />
                </View>
            )}
        </View>
    );
};

export default DynamicImageSelect;
