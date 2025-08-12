import React from 'react';
import { Color } from '../../../../../configs';
import { View } from 'react-native-ui-lib';
import { CustomText } from '../../../../../components';
import CustomButton from '../../../../../components/Button';
import { HistoryCardProps } from '../../../../../types';
import { useTranslation } from 'react-i18next';

const HistoryCard: React.FC<HistoryCardProps> = ({ navigation, rentalId }) => {
    const { t } = useTranslation('payment');
    return (
        <View
            paddingL-15
            padding-10
            row
            style={{ backgroundColor: Color.bgNeutralColor, borderRadius: 5 }}>
            <View style={{ width: '70%' }}>
                <CustomText
                    fontFamily="regular"
                    fontSize="xs"
                    color="primaryColor">
                    {t('PaymentHistory.cardDescription')}
                </CustomText>
            </View>
            <View style={{ width: '30%' }}>
                <CustomButton
                    testID="historyButton"
                    title={t('PaymentHistory.buttonHistory')}
                    onSubmit={() => {
                        navigation.navigate('PaymentHistory', { rentalId });
                    }}
                />
            </View>
        </View>
    );
};

export default HistoryCard;
