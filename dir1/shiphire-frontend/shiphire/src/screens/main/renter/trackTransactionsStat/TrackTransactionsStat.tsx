import { useIsFocused } from '@react-navigation/native';
import React from 'react';
import { ScreenLayout } from '../../../../components';
import { useGetTransactionByRentalId } from '../../../../hooks';
import { TrackTrasactionsStatProps, Transaction } from '../../../../types';
import {
    getStatusText,
    getStatusTextDesc,
    handleAxiosError,
} from '../../../../utils';
import { ShipInformationCard, TransactionProgress } from './components';
import { useTranslation } from 'react-i18next';

const TrackTransactionsStat: React.FC<TrackTrasactionsStatProps> = ({
    route,
}) => {
    const { rentalId } = route.params;
    const isFocused = useIsFocused();
    const mutationGetTransactionById = useGetTransactionByRentalId();
    const [transaction, setTransaction] = React.useState<Transaction>();
    const formattedShipSize = `${transaction?.ship.size.length} m x ${transaction?.ship.size.width} m x ${transaction?.ship.size.height} m`;
    const status = new Array();
    const statusDate = new Array();
    const { t } = useTranslation('common');

    transaction?.status.map(item => {
        const statusClassification = item?.name?.split(' ')[0];
        if (
            item.name !== 'proposal 2' &&
            item.name !== 'contract 2' &&
            item.name !== 'complete' &&
            statusClassification !== 'payment' &&
            statusClassification !== 'sailing'
        ) {
            status.push(getStatusTextDesc(item.desc, t));
            statusDate.push(item.date);
        }

        status.push(getStatusText(item.name, t));
        statusDate.push(item.date);
    });

    React.useEffect(() => {
        isFocused &&
            mutationGetTransactionById.mutate(rentalId, {
                onSuccess: resp => {
                    setTransaction(resp.data.data);
                },
                onError: err => {
                    handleAxiosError(err);
                },
            });
    }, [isFocused]);

    return (
        <ScreenLayout
            backgroundColor="light"
            testId="TrackTransactionsStatScreen"
            padding={10}
            gap={10}>
            <ShipInformationCard
                formattedShipSize={formattedShipSize}
                shipImageUrl={transaction ? transaction.ship.imageUrl : ''}
                shipName={transaction?.ship.name}
                shipCategory={transaction?.ship.category.name}
            />
            <TransactionProgress
                rentalId={rentalId}
                status={status.reverse()}
                statusDate={statusDate.reverse()}
                statusLength={status.length}
            />
        </ScreenLayout>
    );
};

export default TrackTransactionsStat;
