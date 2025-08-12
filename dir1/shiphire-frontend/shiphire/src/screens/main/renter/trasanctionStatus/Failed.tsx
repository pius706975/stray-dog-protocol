import React from 'react';
import {
    CustomText,
    ScreenLayout,
    TransactionCard,
} from '../../../../components';
import { FailedTransactionStatusProps, Transaction } from '../../../../types';
import { useIsFocused } from '@react-navigation/native';
import { useGetAllTransaction, useOpenTransaction } from '../../../../hooks';
import { useTranslation } from 'react-i18next';
import moment from 'moment';

const Failed: React.FC<FailedTransactionStatusProps> = ({ navigation }) => {
    const isFocused = useIsFocused();
    const mutationGetAllTransaction = useGetAllTransaction();
    const mutationOpenTransaction = useOpenTransaction();
    const [transaction, setTransaction] = React.useState<Transaction[]>();
    const { t } = useTranslation('common');

    const failedTransactions = transaction?.filter(item => {
        const statusArray = item.status;
        const lastStatus = statusArray[statusArray.length - 1];
        const fileteredLastStatus = lastStatus?.name;
        return fileteredLastStatus === 'failed';
    });

    const filteredTransaction = failedTransactions?.sort((a, b) => {
        const updatedAtA = new Date(a.updatedAt).getTime();
        const updatedAtB = new Date(b.updatedAt).getTime();
        return updatedAtB - updatedAtA;
    });

    const handleCardPress = () => {
        navigation.navigate('TransactionDetailStack', {
            rentalId: '',
            status: 'failed',
        });
    };

    React.useEffect(() => {
        isFocused &&
            mutationGetAllTransaction.mutate(undefined, {
                onSuccess: resp => {
                    setTransaction(resp.data.data);
                },
                onError: err => {
                    console.log(err);
                },
            });
    }, [isFocused]);

    return filteredTransaction && filteredTransaction.length > 0 ? (
        <ScreenLayout
            testId="FailedStatsScreen"
            backgroundColor="light"
            padding={10}
            gap={10}>
            {filteredTransaction.map((item, index) => {
                const statusArray = item.status;
                const lastStatus = statusArray[statusArray.length - 1];
                const statusKey = lastStatus?.name;
                const translatedStatusText = t(`StatusText.${statusKey}`);
                // const statusText = getStatusText(lastStatus.name);
                const time = moment(item.updatedAt).toDate();
                return (
                    <TransactionCard
                        key={item._id}
                        rentalID={item.rentalId}
                        rentalPeriod={`${item.rentalDuration}d`}
                        status="onProgress"
                        statusText={translatedStatusText}
                        onPress={handleCardPress}
                        time={time}
                    />
                );
            })}
            {/* <TransactionCard
                rentalID="SH-30492342-020823-22222"
                rentalPeriod="3 months"
                status="failed"
                onPress={handleCardPress}
            />
            <TransactionCard
                rentalID="SH-47201223-030223-123"
                rentalPeriod="4 months"
                status="failed"
                onPress={handleCardPress}
            /> */}
        </ScreenLayout>
    ) : (
        <ScreenLayout
            testId="ContractStatsScreen"
            backgroundColor="light"
            flex
            center>
            <CustomText
                fontSize="md"
                color="darkTextColor"
                fontFamily="semiBold">
                {t('TransactionCard.textEmptyFailed')}
            </CustomText>
        </ScreenLayout>
    );
};

export default Failed;
