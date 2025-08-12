import React from 'react';
import { Pressable } from 'react-native';
import { Text, View } from 'react-native-ui-lib';
import { useDispatch } from 'react-redux';
import {
    BlackContractIcon,
    BlackRFQIcon,
    BlackReceiptIcon,
    BlackroposalIcon,
    Color,
    FontFamily,
    FontSize,
} from '../../../../../configs';
import { documentNameSlice } from '../../../../../slices';
import { ShipOwnerDocumentCardProps } from '../../../../../types';
import { useTranslation } from 'react-i18next';

const DocumentCard: React.FC<ShipOwnerDocumentCardProps> = ({
    documentType,
    documentUrl,
    navigation,
    testID,
}) => {
    const dispatch = useDispatch();
    const { t } = useTranslation('transactiondetail');
    const { setDocumentScreenName } = documentNameSlice.actions;

    const handlePresssed = () => {
        if (documentType === 'rfq') {
            dispatch(setDocumentScreenName({ text: 'RFQ' }));
        } else if (documentType === 'proposal') {
            dispatch(setDocumentScreenName({ text: 'Proposal' }));
        } else if (documentType === 'contract') {
            dispatch(setDocumentScreenName({ text: 'Contract' }));
        }

        documentType === 'receipt'
            ? navigation.navigate('Payment', {
                  paymentReceiptUrl: documentUrl,
                  rentalId: '',
              })
            : navigation.navigate('OwnerDocumentPreview', {
                  documentUrl: documentUrl,
                  documentName: documentType,
              });
    };

    return (
        <Pressable testID={testID} onPress={handlePresssed}>
            <View
                flex
                row
                spread
                style={{
                    backgroundColor: Color.bgNeutralColor,
                    borderRadius: 6,
                    padding: 16,
                    alignItems: 'center',
                }}>
                <View
                    row
                    style={{
                        alignItems: 'center',
                        gap: 16,
                        flex: 1,
                    }}>
                    {documentType === 'rfq' && <BlackRFQIcon />}
                    {documentType === 'proposal' && <BlackroposalIcon />}
                    {documentType === 'contract' && <BlackContractIcon />}
                    {documentType === 'receipt' && <BlackReceiptIcon />}
                    <Text
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        style={{
                            fontSize: FontSize.xl,
                            fontFamily: FontFamily.bold,
                            color: Color.primaryColor,
                        }}>
                        {documentType === 'rfq' && t('DocumentCard.textRFQ')}
                        {documentType === 'proposal' &&
                            t('DocumentCard.textProposal')}
                        {documentType === 'contract' &&
                            t('DocumentCard.textContract')}
                        {documentType === 'receipt' &&
                            t('DocumentCard.textReceipt')}
                    </Text>
                </View>
                <View
                    row
                    style={{
                        gap: 6,
                        alignItems: 'center',
                    }}>
                    <Text
                        style={{
                            fontSize: FontSize.xs,
                            fontFamily: FontFamily.regular,
                            color: Color.darkTextColor,
                        }}>
                        {t('DocumentCard.textOpen')}
                    </Text>
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

export default DocumentCard;
