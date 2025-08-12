import React from 'react';
import {
    PaymentTransactionStatusProps,
    Transaction,
    TransactionStatus,
} from '../../../../types';
import { Text } from 'react-native-ui-lib';
import { useIsFocused } from '@react-navigation/native';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import {
    ScreenLayout,
    TransactionCard,
    CustomText,
} from '../../../../components';
import { useGetAllTransaction, useOpenTransaction } from '../../../../hooks';
import { handleAxiosError } from '../../../../utils';

const PaymentStats: React.FC<PaymentTransactionStatusProps> = ({
    navigation,
}) => {
    const { t } = useTranslation('common');
    const isFocused = useIsFocused();
    const mutationGetAllTransaction = useGetAllTransaction();
    const mutationOpenTransaction = useOpenTransaction();
    const [transaction, setTransaction] = React.useState<Transaction[]>();

    const paymentTransaction = transaction?.filter(item => {
        const statusArray = item.status;
        const lastStatus = statusArray[statusArray.length - 1];
        return (
            lastStatus.name === 'payment 1' ||
            lastStatus.name === 'payment 2' ||
            lastStatus.name === 'payment 3'
        );
    });

    const filteredTransaction = paymentTransaction?.sort((a, b) => {
        const updatedAtA = new Date(a.updatedAt).getTime();
        const updatedAtB = new Date(b.updatedAt).getTime();
        return updatedAtB - updatedAtA;
    });

    const handleRespondPressed = (
        rentalId: string | String,
        statusName: string,
        // proposalUrl: string | undefined,
        isOpened: boolean = true,
        paymentReceiptUrl: string,
        transactionId: string,
        status: TransactionStatus[],
    ) => {
        !isOpened &&
            mutationOpenTransaction.mutate(
                { rentalId },
                {
                    onSuccess: () => {
                        console.log('success');
                    },
                    onError: err => {
                        handleAxiosError(err);
                    },
                },
            );

        statusName === 'payment 1' &&
            navigation.navigate('Payment', { transactionId, rentalId });

        if (statusName === 'payment 2' || statusName === 'payment 3') {
            navigation.navigate('PaymentHistory', { rentalId });
        }
    };

    React.useEffect(() => {
        isFocused &&
            mutationGetAllTransaction.mutate(undefined, {
                onSuccess: resp => {
                    setTransaction(resp.data.data);
                },
            });
    }, [isFocused]);
    console.log(filteredTransaction);

    return filteredTransaction && filteredTransaction.length > 0 ? (
        <ScreenLayout
            testId="PaymentStatsScreen"
            backgroundColor="light"
            padding={10}
            gap={10}>
            {filteredTransaction?.map(item => {
                const statusArray = item.status;
                const lastStatus = statusArray[statusArray.length - 1];
                const statusKey = lastStatus?.name;
                const translatedStatusText = t(`StatusText.${statusKey}`);
                const time = moment(item.updatedAt).toDate();

                return (
                    <TransactionCard
                        key={item._id}
                        rentalID={item.rentalId}
                        rentalPeriod={`${item.rentalDuration}d`}
                        status="onProgress"
                        statusText={translatedStatusText}
                        onPress={() => {
                            navigation.navigate('TransactionDetailStack', {
                                status: 'proposal',
                                rentalId: item.rentalId,
                            });
                        }}
                        imageUrl={item.ship.imageUrl}
                        shipName={item.ship.name}
                        shipCategory={item.ship.category.name}
                        shipSize={item.ship.size}
                        responded
                        respondKey={
                            lastStatus.name === 'payment 1'
                                ? t('TransactionCard.respondKeyContract2')
                                : lastStatus.name === 'payment 2'
                                ? t('TransactionCard.respondKeyPayment1')
                                : lastStatus.name === 'payment 3'
                                ? t('TransactionCard.respondKeyPayment2')
                                : t('TransactionCard.respondKeyElse')
                        }
                        respondKeyAlert={
                            lastStatus.isOpened === false &&
                            lastStatus.name === 'payment 1'
                        }
                        respondKeySuccess={lastStatus.name === 'contract 1'}
                        respondValue={
                            lastStatus.name === 'payment 1'
                                ? t('TransactionCard.respondValueContract2')
                                : lastStatus.name === 'payment 2' ||
                                  lastStatus.name === 'payment 3'
                                ? t('TransactionCard.respondValuePayment1')
                                : t('TransactionCard.respondValueContractElse')
                        }
                        respondPressed={() =>
                            handleRespondPressed(
                                item.rentalId,
                                lastStatus.name,
                                // item?.proposal[item.proposal.length - 1]
                                //     ?.proposalUrl,
                                lastStatus.isOpened,
                                item.payment[item.payment.length - 1]
                                    .receiptUrl,
                                item._id,
                                statusArray,
                            )
                        }
                        newRespond={
                            lastStatus.isOpened === false &&
                            lastStatus.name === 'payment 1'
                        }
                        time={time}
                    />
                );
            })}
        </ScreenLayout>
    ) : (
        <ScreenLayout
            testId="ProposalStatsScreen"
            backgroundColor="light"
            flex
            center>
            <CustomText
                fontSize="md"
                color="darkTextColor"
                fontFamily="semiBold">
                {t('TransactionCard.textEmptyPayment')}
            </CustomText>
        </ScreenLayout>
    );
};

export default PaymentStats;
