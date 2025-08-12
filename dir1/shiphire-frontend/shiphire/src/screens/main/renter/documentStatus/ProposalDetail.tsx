import React from 'react';
import { Text, View } from 'react-native-ui-lib';
import { ScreenLayout, TransactionCard } from '../../../../components';
import { FontFamily, FontSize, Color } from '../../../../configs';
import { ProposalDetailProps } from '../../../../types';
import { useTranslation } from 'react-i18next';

const ProposalDetail: React.FC<ProposalDetailProps> = ({ navigation }) => {
    const { t } = useTranslation('account');
    return (
        <ScreenLayout
            testId="ProposalDetailScreen"
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
                    {t('ProposalDetail.textOnProgress')}
                </Text>
                <TransactionCard
                    rentalID="SH-47201223-030223-123"
                    rentalPeriod="4 months"
                    status="onProgress"
                    statusText={t('ProposalDetail.textStatusTextOnProgress')}
                />
            </View>
            <View>
                <Text
                    style={{
                        fontFamily: FontFamily.bold,
                        fontSize: FontSize.md,
                        color: Color.primaryColor,
                    }}>
                    {t('ProposalDetail.textCompleted')}
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
                    {t('ProposalDetail.textFailed')}
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

export default ProposalDetail;
