import { useIsFocused } from '@react-navigation/native';
import moment from 'moment';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
    CustomText,
    ScreenLayout,
    TransactionCard,
} from '../../../../components';
import { useGetAllOwnerTransaction } from '../../../../hooks';
import {
    OwnerAcceptPaymentTransactionStatusProps,
    Transaction,
} from '../../../../types';
import { getStatusText } from '../../../../utils';

const AcceptPaymentStats: React.FC<
    OwnerAcceptPaymentTransactionStatusProps
> = ({ navigation }) => {
    const { t } = useTranslation('common');
    const isFocused = useIsFocused();
    const mutationGetAllTransaction = useGetAllOwnerTransaction();
    const [transaction, setTransaction] = React.useState<Transaction[]>();

    const rfqTransactions = transaction?.filter(item => {
        const statusArray = item.status;
        const lastStatus = statusArray[statusArray.length - 1];

        return (
            lastStatus.name === 'payment 1' ||
            lastStatus.name === 'payment 2' ||
            lastStatus.name === 'payment 3'
        );
    });

    const filteredTransaction = rfqTransactions?.sort((a, b) => {
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
            testId="AcceptPaymentStatsScreen"
            backgroundColor="light"
            padding={10}
            gap={10}>
            {filteredTransaction?.map(item => {
                const statusArray = item.status;
                const lastStatus = statusArray[statusArray.length - 1];
                const statusKey = lastStatus?.name;
                const translatedStatusText = t(`OwnerStatusText.${statusKey}`);
                // const statusText = getStatusText(lastStatus.name);
                const time = moment(item.updatedAt).toDate();
                console.log(item.payment[item.payment.length - 1].receiptUrl);

                return (
                    <TransactionCard
                        key={item._id}
                        rentalID={item.rentalId}
                        rentalPeriod={`${item.rentalDuration}d`}
                        status="onProgress"
                        statusText={translatedStatusText}
                        onPress={
                            () =>
                                navigation.navigate(
                                    'ShipOwnerTransactionDetail',
                                    {
                                        status: 'payment',
                                        rentalId: item.rentalId,
                                    },
                                )
                            // () =>
                            // navigation.navigate('Payment', {
                            //     paymentReceiptUrl: item.receiptUrl,
                            //     rentalId: item.rentalId,
                            // })
                        }
                        imageUrl={item.ship.imageUrl}
                        shipName={item.ship.name}
                        shipCategory={item.ship.category.name}
                        shipSize={item.ship.size}
                        time={time}
                        responded
                        respondKey={
                            lastStatus.name === 'payment 2'
                                ? t('TransactionCard.respondKeyPayment1')
                                : lastStatus.name === 'payment 1'
                                ? t('TransactionCard.respondKeyPayment1Owner')
                                : t('TransactionCard.respondKeyPayment2Owner')
                        }
                        respondValue={
                            lastStatus.name === 'payment 2'
                                ? t('AcceptPaymentStats.respondValue')
                                : t(
                                      'TransactionCard.respondValueProposalWaiting1',
                                  )
                        }
                        respondKeyAlert={lastStatus.isOpened !== true}
                        respondPressed={() => {
                            console.log(item.shipRentType);

                            if (lastStatus.name === 'payment 1') {
                                navigation.navigate('PaymentOwnerHistory', {
                                    payment: item.payment,
                                    rentType: item.shipRentType,
                                });
                            } else {
                                navigation.navigate('Payment', {
                                    paymentReceiptUrl:
                                        item.payment[item.payment.length - 1]
                                            .receiptUrl,
                                    rentalId: item.rentalId,
                                    sailingStatus: '',
                                    beforeSailingPictures:
                                        item.beforeSailingPictures,
                                    payment: item.payment,
                                    rentType: item.shipRentType,
                                    lastStatus: lastStatus.name
                                });
                            }
                        }}
                    />
                );
            })}
        </ScreenLayout>
    ) : (
        <ScreenLayout
            testId="AcceptPaymentStatsScreen"
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

export default AcceptPaymentStats;
