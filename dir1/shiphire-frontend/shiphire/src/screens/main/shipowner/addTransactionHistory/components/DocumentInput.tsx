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

const DocumentInput = ({
    setSelectedDocument,
    additionalDocList,
    setAdditionalDocList,
    openModal,
}) => {
    const { t } = useTranslation('detailship');
    return (
        <View
            style={{
                padding: 5,
            }}>
            {additionalDocList.length > 0 && (
                <View marginB-10>
                    <CustomText
                        color="primaryColor"
                        fontFamily="regular"
                        fontSize="md">
                        {t('ShipOwner.AddTransactionHistory.textDocumentList')}
                    </CustomText>
                </View>
            )}
            {additionalDocList.map((item, index) => (
                <View
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
                            testID={`additional-doc-${index}`}
                            onPress={() => {
                                setSelectedDocument(item);
                                openModal();
                            }}>
                            <View
                                row
                                style={{
                                    alignItems: 'center',
                                    gap: 16,
                                    padding: 7,
                                }}>
                                <DocumentIcon />
                                <Text
                                    style={{
                                        fontSize: FontSize.lg,
                                        fontFamily: FontFamily.bold,
                                        color: Color.primaryColor,
                                    }}>
                                    {item.name}
                                </Text>
                            </View>
                        </Pressable>
                        <Pressable
                            onPress={() =>
                                setAdditionalDocList(prevItems =>
                                    prevItems.filter(
                                        prevItem => prevItem.id !== item.id,
                                    ),
                                )
                            }
                            style={{
                                gap: 6,
                                padding: 7,
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

export default DocumentInput;
