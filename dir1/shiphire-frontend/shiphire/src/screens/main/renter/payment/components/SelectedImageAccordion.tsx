import { ListItem } from '@rneui/base';
import React from 'react';
import { Image, View } from 'react-native-ui-lib';
import { Button, CustomText } from '../../../../../components';
import { Color } from '../../../../../configs';
import { SelectedImageAccordionProps } from '../../../../../types';
import { useTranslation } from 'react-i18next';

const SelectedImageAccordion: React.FC<SelectedImageAccordionProps> = ({
    handleOpenImage,
    handleSendReceipt,
    selectedImagePath,
    isSubmittingSendReceipt,
    testID,
}) => {
    const { t } = useTranslation('payment');
    const [paymentReceiptExpanded, setPaymentReceiptExpanded] =
        React.useState<boolean>(true);

    return (
        <ListItem.Accordion
            testID={testID}
            content={
                <CustomText
                    fontFamily="bold"
                    fontSize="lg"
                    color="primaryColor">
                    {t('SelectedImageAccordion.textPaymentReceipt')}
                </CustomText>
            }
            containerStyle={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-between',
                backgroundColor: Color.secColor,
                borderRadius: 6,
                padding: 16,
                alignItems: 'center',
            }}
            isExpanded={paymentReceiptExpanded}
            onPress={() => {
                setPaymentReceiptExpanded(!paymentReceiptExpanded);
            }}>
            <View
                flex
                center
                style={{
                    backgroundColor: Color.secColor,
                    borderBottomEndRadius: 6,
                    borderBottomStartRadius: 6,
                    top: -28,
                    marginBottom: -28,
                    padding: 16,
                }}>
                <Image
                    source={{
                        uri: selectedImagePath
                            ? selectedImagePath
                            : 'https://picsum.photos/id/237/200/300',
                    }}
                    style={{ width: 280, height: 360 }}
                />
                <View
                    row
                    style={{
                        width: '100%',
                        justifyContent: 'space-around',
                        marginTop: 20,
                    }}>
                    <Button
                        title={t(
                            'SelectedImageAccordion.labelButtonEditReceipt',
                        )}
                        color="warning"
                        onSubmit={handleOpenImage}
                    />
                    <Button
                        title={t(
                            'SelectedImageAccordion.labelButtonSendReceipt',
                        )}
                        color="success"
                        onSubmit={handleSendReceipt}
                        isSubmitting={isSubmittingSendReceipt}
                    />
                </View>
            </View>
        </ListItem.Accordion>
    );
};

export default SelectedImageAccordion;
