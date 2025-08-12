import React from 'react';
import { View, Text } from 'react-native-ui-lib';
import {
    ShipOwnerTransactionDetailProps,
    Transaction,
} from '../../../../types';
import { useIsFocused } from '@react-navigation/native';
import {
    useGetTransactionById,
    useGetTransactionByRentalId,
    useOpenTransaction,
    useSubmitShipPicturesBeforeSailing,
} from '../../../../hooks';
import { useTranslation } from 'react-i18next';
import {
    getOwnerStatusText,
    getStatusText,
    handleAxiosError,
} from '../../../../utils';
import { Button, ScreenLayout } from '../../../../components';
import {
    CompleteFlag,
    DocumentCard,
    ShipInformationCard,
    TransactionStatusCard,
} from './components';

const ShipOwnerTransactionDetail: React.FC<ShipOwnerTransactionDetailProps> = ({
    navigation,
    route,
}) => {
    const isFocused = useIsFocused();
    const { status, rentalId } = route.params;

    const mutationGetTransactionById = useGetTransactionById();
    const mutationOpenTransaction = useOpenTransaction();
    const mutationSubmitShipPicturesBeforeSailing =
        useSubmitShipPicturesBeforeSailing();
    const [transaction, setTransaction] = React.useState<Transaction>();
    const { t } = useTranslation('common');
    const formattedShipSize = `${transaction?.ship.size.length} m x ${transaction?.ship.size.width} m x ${transaction?.ship.size.height} m`;
    const statusArray = transaction
        ? transaction.status
        : [{ name: 'rfq', desc: 'Request for Quote', isOpened: true }];
    const lastStatus = statusArray[statusArray.length - 1];
    const lastStatusText = getOwnerStatusText(lastStatus.name, t);
    const rentalPeriod = transaction ? transaction.rentalDuration : 0;
    const dateDefaultValue = new Date(0);

    const handleRespondPressed = () => {
        !lastStatus.isOpened &&
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
        lastStatus.name === 'rfq 1' &&
            navigation.navigate('OwnerDocumentPreview', {
                documentUrl: transaction ? transaction.rfq.rfqUrl : '',
                documentName: 'RFQ Document',
                rentalId: rentalId ? rentalId.toString() : '',
                isButtonActive: true,
                clickName: 'acceptRFQ',
                btnText: t('RFQStats.btnAcceptRFQ'),
            });
        lastStatus.name === 'rfq 2' && navigation.goBack();
        lastStatus.name === 'proposal 3' && navigation.goBack();
    };

    React.useEffect(() => {
        isFocused &&
            mutationGetTransactionById.mutate(rentalId, {
                onSuccess: resp => {
                    setTransaction(resp.data.data);
                    console.log(
                        'test',
                        JSON.stringify(resp.data.data, null, 2),
                    );
                },
                onError: err => {
                    console.log('error', err);
                    handleAxiosError(err);
                },
            });
    }, [isFocused]);

    return (
        <ScreenLayout
            testId="ShipOwnerTransactionDetailScreen"
            backgroundColor="light"
            padding={10}
            gap={10}>
            <CompleteFlag visible={status === 'complete'} />
            <ShipInformationCard
                formattedShipSize={formattedShipSize}
                shipImageUrl={transaction ? transaction.ship.imageUrl : ''}
                shipName={transaction?.ship.name}
                shipCategory={transaction?.ship.category.name}
            />
            {lastStatus.name === 'payment 3' ? (
                <Button
                    title={t('SaveShipPictures.btnBefore')}
                    onSubmit={() =>
                        navigation.navigate('ShipPictures', {
                            transactionId: transaction?._id ?? '',
                            sailingStatus: 'beforeSailing',
                            beforeSailingPictures:
                                transaction?.beforeSailingPictures,
                            afterSailingPictures:
                                transaction?.afterSailingPictures,
                        })
                    }
                />
            ) : null}
            {lastStatus.name === 'sailing 4' &&
            !transaction?.afterSailingPictures.length ? (
                <Button
                    title={t('SaveShipPictures.btnAfter')}
                    onSubmit={() =>
                        navigation.navigate('ShipPicturesAfterRent', {
                            transactionId: transaction?._id ?? '',
                            sailingStatus: 'afterSailing',
                            beforeSailingPictures:
                                transaction?.beforeSailingPictures,
                            afterSailingPictures:
                                transaction?.afterSailingPictures,
                        })
                    }
                />
            ) : null}

            {transaction &&
            transaction.beforeSailingPictures &&
            transaction.beforeSailingPictures.length > 0 &&
            transaction.afterSailingPictures &&
            transaction.afterSailingPictures.length > 0 ? (
                <Button
                    title={t('SaveShipPictures.btnDone')}
                    onSubmit={() =>
                        navigation.navigate('SeeShipPictures', {
                            transactionId: transaction?._id ?? '',
                            sailingStatus: '',
                            beforeSailingPictures:
                                transaction?.beforeSailingPictures,
                            afterSailingPictures:
                                transaction?.afterSailingPictures,
                        })
                    }
                />
            ) : null}

            <TransactionStatusCard
                lastStatusText={lastStatusText}
                rentalId={rentalId}
                status={status}
                rentalPeriod={rentalPeriod}
                lastStatusName={lastStatus.name}
                navigation={navigation}
                newRespond={
                    lastStatus.isOpened === false && lastStatus.name === 'rfq 1'
                }
                handleRespondPressed={handleRespondPressed}
                alertRespond={
                    lastStatus.isOpened === true && lastStatus.name === 'rfq 1'
                }
                offeredPrice={transaction ? transaction.offeredPrice : 0}
                paymentDate={
                    statusArray.length > 2
                        ? transaction?.status[2].date
                        : dateDefaultValue
                }
                approveDate={
                    statusArray.length > 4
                        ? transaction?.status[4].date
                        : dateDefaultValue
                }
                statusLength={statusArray.length}
            />
            <DocumentCard
                testID="DocumentCardRFQ"
                documentType="rfq"
                documentUrl={transaction ? transaction.rfq.rfqUrl : ''}
                navigation={navigation}
            />
            {/* {transaction?.proposal &&
                transaction.proposal.proposalUrl?.length > 3 && (
                    <DocumentCard
                        documentType="proposal"
                        documentUrl={
                            transaction ? transaction.proposal.proposalUrl : ''
                        }
                        navigation={navigation}
                    />
                )} */}
            {transaction?.payment &&
                transaction?.payment[transaction.payment.length] &&
                transaction.payment[transaction.payment.length]?.receiptUrl && (
                    <DocumentCard
                        documentType="receipt"
                        documentUrl={
                            transaction
                                ? transaction.payment[
                                      transaction.payment.length
                                  ].receiptUrl
                                : ''
                        }
                        navigation={navigation}
                    />
                )}
            {transaction?.contract &&
                transaction.contract.contractUrl?.length > 3 && (
                    <DocumentCard
                        documentType="contract"
                        documentUrl={
                            transaction ? transaction.contract.contractUrl : ''
                        }
                        navigation={navigation}
                    />
                )}
        </ScreenLayout>
    );
};

export default ShipOwnerTransactionDetail;
