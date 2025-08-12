import React from 'react';
import { Text, View } from 'react-native-ui-lib';
import { CustomText } from '../../../../../components';
import {
    Color,
    DocumentIcon,
    FontFamily,
    FontSize,
    TrashIcon,
} from '../../../../../configs';
import { Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';

const ImageInput = ({
    setSelectedImage,
    additionalImageList,
    setAdditionalImageList,
    openModal,
    testId,
}) => {
    const { t } = useTranslation('common');
    return (
        <View
            style={{
                padding: 5,
            }}>
            {additionalImageList.length > 0 && (
                <View marginB-10>
                    <CustomText
                        color="primaryColor"
                        fontFamily="regular"
                        fontSize="md">
                        {t('FormNegotiateRenter.NegotiateForm.textImageList')}
                    </CustomText>
                </View>
            )}
            {additionalImageList.map((item, index) => (
                <View
                    testID={`additionalImageList-${index}`}
                    key={index}
                    style={{
                        borderBottomWidth: 1,
                        borderBottomColor: Color.darkTextColor,
                    }}>
                    <View
                        style={{
                            borderRadius: 6,
                            alignItems: 'flex-start',
                            margin: 6,
                            justifyContent: 'space-between',
                            flexDirection: 'row',
                        }}>
                        <Pressable
                            testID="buttonImageInput"
                            onPress={() => {
                                setSelectedImage(item);
                                openModal();
                            }}>
                            <View
                                flex-1
                                row
                                style={{
                                    alignItems: 'center',
                                    gap: 16,
                                }}>
                                <View style={{ width: '90%' }}>
                                    <Text
                                        style={{
                                            fontSize: FontSize.lg,
                                            fontFamily: FontFamily.bold,
                                            color: Color.primaryColor,
                                        }}>
                                        {`${t(
                                            'FormNegotiateRenter.NegotiateHistory.textImage',
                                        )} ${index + 1}`}
                                    </Text>
                                    <Text
                                        style={{
                                            fontSize: FontSize.sm,
                                            fontFamily: FontFamily.regular,
                                            color: Color.darkTextColor,
                                        }}>
                                        {item.imageNotes}
                                    </Text>
                                </View>
                            </View>
                        </Pressable>
                        <Pressable
                            onPress={() =>
                                setAdditionalImageList(prevItems =>
                                    prevItems.filter(
                                        prevItem => prevItem.id !== item.id,
                                    ),
                                )
                            }
                            style={{
                                gap: 6,
                                padding: 7,
                                alignSelf: 'center',
                            }}>
                            <Text
                                style={{
                                    fontSize: FontSize.xs,
                                    fontFamily: FontFamily.regular,
                                    color: Color.darkTextColor,
                                }}>
                                <TrashIcon />
                            </Text>
                        </Pressable>
                    </View>
                </View>
            ))}
        </View>
    );
};

export default ImageInput;
