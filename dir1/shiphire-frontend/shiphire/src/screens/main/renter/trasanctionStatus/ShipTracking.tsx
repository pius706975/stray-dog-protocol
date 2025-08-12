import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import {
    OwnerShipTrackingTransactionStatusProps,
    Transaction,
} from '../../../../types';
import { useGetAllTransaction } from '../../../../hooks';
import {
    CustomText,
    ScreenLayout,
    TransactionCard,
} from '../../../../components';

const ShipTracking: React.FC<OwnerShipTrackingTransactionStatusProps> = ({
    navigation,
}) => {
    const isFocused = useIsFocused();
    const mutationGetAllTransaction = useGetAllTransaction();
    const [transaction, setTransaction] = useState<Transaction[]>();
    const { t } = useTranslation('common');

    const fetchTransactions = useCallback(() => {
        if (isFocused) {
            mutationGetAllTransaction.mutate(undefined, {
                onSuccess: resp => {
                    setTransaction(resp.data.data);
                },
            });
        }
    }, [isFocused]);

    useEffect(() => {
        fetchTransactions();
    }, [fetchTransactions]);

    const sailingTransactions = useMemo(() => {
        return transaction?.filter(item => {
            const statusArray = item.status;
            const lastStatus = statusArray[statusArray.length - 1];
            const filteredLastStatus = lastStatus?.name.split(' ')[0];
            return (
                filteredLastStatus === 'sailing' &&
                item.beforeSailingPictures.length > 0
            );
        });
    }, [transaction]);

    const filteredTransaction = useMemo(() => {
        return sailingTransactions?.sort((a, b) => {
            const updatedAtA = new Date(a.updatedAt).getTime();
            const updatedAtB = new Date(b.updatedAt).getTime();
            return updatedAtB - updatedAtA;
        });
    }, [sailingTransactions]);

    const renderTransactionCard = useCallback(
        (item: Transaction) => {
            const statusArray = item.status;
            const lastStatus = statusArray[statusArray.length - 1];
            const statusKey = lastStatus?.name;
            const translatedStatusText = t(`OwnerStatusText.${statusKey}`);
            const time = moment(item.updatedAt).toDate();
            const statusNeedAction = ['sailing 2'];

            return (
                <TransactionCard
                    key={item._id}
                    rentalID={item.rentalId}
                    rentalPeriod={`${item.rentalDuration}d`}
                    status="onProgress"
                    statusText={translatedStatusText}
                    onPress={() =>
                        navigation.navigate('TransactionDetailStack', {
                            status: 'sailing',
                            rentalId: item.rentalId,
                        })
                    }
                    imageUrl={item.ship.imageUrl}
                    shipName={item.ship.name}
                    shipCategory={item.ship.category.name}
                    shipSize={item.ship.size}
                    time={time}
                    responded
                    respondKey={
                        statusNeedAction.includes(statusKey)
                            ? t('TransactionCard.respondKeyTracking2')
                            : t('TransactionCard.respondKeyTracking')
                    }
                    respondKeyAlert={statusNeedAction.includes(statusKey)}
                    respondValue={t('TransactionCard.respondValueTracking')}
                    respondPressed={() =>
                        navigation.navigate('ShipTrackingDetail', {
                            rentalId: item.rentalId,
                        })
                    }
                />
            );
        },
        [navigation, t],
    );

    return filteredTransaction && filteredTransaction.length > 0 ? (
        <ScreenLayout
            testId="ShipTrackingScreen"
            backgroundColor="light"
            padding={10}
            gap={10}>
            {filteredTransaction.map(renderTransactionCard)}
        </ScreenLayout>
    ) : (
        <ScreenLayout
            testId="ShipTrackingScreen"
            backgroundColor="light"
            flex
            center>
            <CustomText
                fontSize="md"
                color="darkTextColor"
                fontFamily="semiBold">
                {t('TransactionCard.textEmptyTracking')}
            </CustomText>
        </ScreenLayout>
    );
};

export default ShipTracking;
