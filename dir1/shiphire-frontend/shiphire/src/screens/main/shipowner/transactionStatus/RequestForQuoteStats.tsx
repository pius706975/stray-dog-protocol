import { useIsFocused } from '@react-navigation/native';
import moment from 'moment';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
    CustomText,
    ScreenLayout,
    TransactionCard,
} from '../../../../components';
import {
    useGetAllOwnerTransaction,
    useOpenTransaction,
} from '../../../../hooks';
import { OwnerRFQTransactionStatusProps, Transaction } from '../../../../types';
import { handleAxiosError } from '../../../../utils';

const OwnerRequestForQuoteStats: React.FC<OwnerRFQTransactionStatusProps> = ({
    navigation,
}) => {
    const { t } = useTranslation('common');
    const isFocused = useIsFocused();
    const mutationGetAllTransaction = useGetAllOwnerTransaction();
    const mutationOpenTransaction = useOpenTransaction();
    const [transaction, setTransaction] = React.useState<Transaction[]>();

    const rfqTransactions = transaction?.filter(item => {
        const statusArray = item.status;
        const lastStatus = statusArray[statusArray.length - 1];
        return lastStatus.name === 'rfq 1';
    });

    const filteredTransaction = rfqTransactions?.sort((a, b) => {
        const updatedAtA = new Date(a.updatedAt).getTime();
        const updatedAtB = new Date(b.updatedAt).getTime();
        return updatedAtB - updatedAtA;
    });

    const handleNavigateToDocumentPreview = (
        documentUrl: string,
        rentalId: string,
    ) => {
        navigation.navigate('OwnerDocumentRFQ', {
            documentUrl,
            rentalId,
            documentName: 'RFQ Document',
        });
    };

    const handleRespondPressed = (rentalId: string, rfqUrl: string) => {
        mutationOpenTransaction.mutate(
            { rentalId },
            {
                onSuccess: () => {
                    handleNavigateToDocumentPreview(rfqUrl, rentalId);
                },
                onError: err => {
                    handleAxiosError(err);
                },
            },
        );
    };

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
            testId="RequestForQuoteStatsScreen"
            backgroundColor="light"
            padding={10}
            gap={10}>
            {filteredTransaction?.map(item => {
                const statusArray = item.status;
                const lastStatus = statusArray[statusArray.length - 1];
                const statusKey = lastStatus?.name;
                const translatedStatusText = t(`OwnerStatusText.${statusKey}`);
                // const statusText = getOwnerStatusText(lastStatus.name);
                const time = moment(item.updatedAt).toDate();
                console.log(time);

                return (
                    <TransactionCard
                        key={item._id}
                        rentalID={item.rentalId}
                        rentalPeriod={`${item.rentalDuration}d`}
                        status="onProgress"
                        statusText={translatedStatusText}
                        onPress={() => {
                            navigation.navigate('ShipOwnerTransactionDetail', {
                                status: 'rfq',
                                rentalId: item.rentalId,
                            });
                            // handleNavigateToDocumentPreview(
                            //     item.rfq.rfqUrl,
                            //     item.rentalId,
                            // );
                        }}
                        imageUrl={item.ship.imageUrl}
                        shipName={item.ship.name}
                        shipCategory={item.ship.category.name}
                        shipSize={item.ship.size}
                        time={time}
                        responded
                        respondKey={t('RFQStats.respondKey')}
                        respondValue={t('RFQStats.respondValue')}
                        respondKeyAlert={lastStatus.isOpened !== true}
                        respondPressed={() =>
                            handleRespondPressed(item.rentalId, item.rfq.rfqUrl)
                        }
                    />
                );
            })}
        </ScreenLayout>
    ) : (
        <ScreenLayout
            testId="RequestForQuoteStatsScreen"
            backgroundColor="light"
            flex
            center>
            <CustomText
                fontSize="md"
                color="darkTextColor"
                fontFamily="semiBold">
                {t('TransactionCard.textEmptyRFQ')}
            </CustomText>
        </ScreenLayout>
    );
};

export default OwnerRequestForQuoteStats;
