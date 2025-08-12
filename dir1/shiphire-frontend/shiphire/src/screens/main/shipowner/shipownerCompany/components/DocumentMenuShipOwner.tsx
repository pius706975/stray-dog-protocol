import React from 'react';
import { Pressable, Text } from 'react-native';
import {
    Color,
    DocumentIcon,
    FontSize,
    FontFamily,
} from '../../../../../configs';
import { View } from 'react-native-ui-lib';
import { DocumentMenuShipOwnerProps } from '../../../../../types';
import { useDispatch } from 'react-redux';
import { documentNameSlice } from '../../../../../slices';
import { useTranslation } from 'react-i18next';

const DocumentMenuShipOwner: React.FC<DocumentMenuShipOwnerProps> = ({
    navigation,
    pdfUrl,
    documentName,
    label,
}) => {
    const dispatch = useDispatch();
    const { setDocumentScreenName } = documentNameSlice.actions;
    const { t } = useTranslation('account')

    return (
        <Pressable
            onPress={() => {
                dispatch(setDocumentScreenName({ text: label }));
                navigation.navigate('OwnerDocumentPreview', {
                    documentUrl: pdfUrl!!,
                    documentName: documentName!!,
                });
            }}>
            <View
                style={{
                    backgroundColor: Color.bgNeutralColor,
                    borderRadius: 6,
                    padding: 10,
                    alignItems: 'flex-start',
                    margin: 6,
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                }}>
                <View
                    row
                    style={{
                        alignItems: 'center',
                        gap: 16,
                    }}>
                    <DocumentIcon />
                    <Text
                        style={{
                            fontSize: FontSize.lg,
                            fontFamily: FontFamily.bold,
                            color: Color.primaryColor,
                        }}>
                        {label}
                    </Text>
                </View>
                <View
                    row
                    style={{
                        gap: 6,
                        padding: 7,
                        borderRadius: 6,
                        backgroundColor: Color.primaryColor,
                    }}>
                    <Text
                        style={{
                            fontSize: FontSize.sm,
                            fontFamily: FontFamily.bold,
                            color: Color.lightTextColor,
                        }}>
                        {t('CompanyProfile.btnView')}
                    </Text>
                </View>
            </View>
        </Pressable>
    );
};

export default DocumentMenuShipOwner;
