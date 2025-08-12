import { useIsFocused } from '@react-navigation/native';
import moment from 'moment';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
    CustomText,
    ScreenLayout,
    TransactionCard,
} from '../../../../components';
import { useGetAllTransaction } from '../../../../hooks';
import { CompleteTransactionStatusProps, Transaction } from '../../../../types';
import { getStatusText } from '../../../../utils';

const Complete: React.FC<CompleteTransactionStatusProps> = ({ navigation }) => {
    const isFocused = useIsFocused();
    const mutationGetAllTransaction = useGetAllTransaction();
    const [transaction, setTransaction] = React.useState<Transaction[]>();
    const { t } = useTranslation('common');

    const completeTransactions = transaction?.filter(item => {
        const statusArray = item.status;
        const lastStatus = statusArray[statusArray.length - 1];
        const fileteredLastStatus = lastStatus?.name.split(' ')[0];
        return fileteredLastStatus === 'complete';
    });

    const filteredTransaction = completeTransactions?.sort((a, b) => {
        const updatedAtA = new Date(a.updatedAt).getTime();
        const updatedAtB = new Date(b.updatedAt).getTime();
        return updatedAtB - updatedAtA;
    });

    React.useEffect(() => {
        isFocused &&
            mutationGetAllTransaction.mutate(undefined, {
                onSuccess: resp => {
                    setTransaction(resp.data.data);
                },
            });
    }, [isFocused]);

    return filteredTransaction && filteredTransaction.length > 0 ? (
        <ScreenLayout
            testId="CompleteStatsScreen"
            backgroundColor="light"
            padding={10}
            gap={10}>
            {filteredTransaction?.map(item => {
                const statusArray = item.status;
                const lastStatus = statusArray[statusArray.length - 1];
                const statusText = getStatusText(lastStatus.name, t);
                const time = moment(item.updatedAt).toDate();

                return (
                    <TransactionCard
                        key={item._id}
                        rentalID={item.rentalId}
                        rentalPeriod={`${item.rentalDuration}d`}
                        status="complete"
                        statusText={statusText}
                        onPress={() => {
                            navigation.navigate('TransactionDetailStack', {
                                status: 'complete',
                                rentalId: item.rentalId,
                            });
                        }}
                        imageUrl={item.ship.imageUrl}
                        shipName={item.ship.name}
                        shipCategory={item.ship.category.name}
                        shipSize={item.ship.size}
                        time={time}
                    />
                );
            })}
        </ScreenLayout>
    ) : (
        <ScreenLayout
            testId="CompleteScreen"
            backgroundColor="light"
            flex
            center>
            <CustomText
                fontSize="md"
                color="darkTextColor"
                fontFamily="semiBold">
                {t('TransactionCard.textEmptyComplete')}
            </CustomText>
        </ScreenLayout>
    );
};

export default Complete;
