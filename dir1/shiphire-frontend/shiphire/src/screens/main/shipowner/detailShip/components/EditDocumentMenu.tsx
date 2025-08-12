import React from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, Text } from 'react-native';
import { View } from 'react-native-ui-lib';
import {
    Color,
    DocumentIcon,
    FontFamily,
    FontSize,
} from '../../../../../configs';
import { EditDocumentMenuProps } from '../../../../../types';
import moment from 'moment';

const EditDocumentMenu: React.FC<EditDocumentMenuProps> = ({
    navigation,
    pdfUrl,
    label,
    shipId,
    documentName,
    documentExpired,
}) => {
    const expired = moment(documentExpired).format('DD MMMM YYYY');
    const { t } = useTranslation('detailship');
    return (
        <Pressable
            onPress={() => {
                navigation.navigate('OwnerDocumentPreview', {
                    documentUrl: pdfUrl!!,
                    isButtonActive: true,
                    shipId,
                    documentName,
                    clickName: 'editShipDocument',
                    btnText: t('ShipOwner.textEditDocument'),
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
                    <View>
                        <Text
                            style={{
                                fontSize: FontSize.lg,
                                fontFamily: FontFamily.bold,
                                color: Color.primaryColor,
                            }}>
                            {label}
                        </Text>
                        {documentExpired && (
                            <Text
                                style={{
                                    fontSize: FontSize.xs,
                                    fontFamily: FontFamily.regular,
                                    color: Color.darkTextColor,
                                }}>
                                {t('ShipOwner.textExpiredDocument')} : {expired}
                            </Text>
                        )}
                    </View>
                </View>
                <View
                    row
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
                        {'>'}
                    </Text>
                </View>
            </View>
        </Pressable>
    );
};

export default EditDocumentMenu;
