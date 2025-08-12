import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View } from 'react-native-ui-lib';
import { ScreenLayout, TransactionCard } from '../../../../components';
import { Color, FontFamily, FontSize } from '../../../../configs';
import { RequestDetailProps } from '../../../../types';

const RequestDetail: React.FC<RequestDetailProps> = ({ navigation }) => {
    const { t } = useTranslation('account');
    return (
        <ScreenLayout
            testId="RequestDetailScreen"
            backgroundColor="light"
            padding={20}
            gap={20}>
            <View>
                <Text
                    style={{
                        fontFamily: FontFamily.bold,
                        fontSize: FontSize.md,
                        color: Color.primaryColor,
                    }}>
                    {t('RequestDetail.textOnProgress')}
                </Text>
                <TransactionCard
                    rentalID="SH-47201223-030223-123"
                    rentalPeriod="4 months"
                    status="onProgress"
                    statusText={t('RequestDetail.textStatusTextOnProgress')}
                />
            </View>
            <View>
                <Text
                    style={{
                        fontFamily: FontFamily.bold,
                        fontSize: FontSize.md,
                        color: Color.primaryColor,
                    }}>
                    {t('RequestDetail.textCompleted')}
                </Text>
                <TransactionCard
                    rentalID="SH-30492342-020823-22222"
                    rentalPeriod="3 months"
                    status="complete"
                />
            </View>
            <View>
                <Text
                    style={{
                        fontFamily: FontFamily.bold,
                        fontSize: FontSize.md,
                        color: Color.primaryColor,
                    }}>
                    {t('RequestDetail.textFailed')}
                </Text>
                <TransactionCard
                    rentalID="SH-30492342-020823-22222"
                    rentalPeriod="3 months"
                    status="failed"
                />
            </View>
        </ScreenLayout>
    );
};
export default RequestDetail;
