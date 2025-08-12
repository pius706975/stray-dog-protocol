import { useIsFocused } from '@react-navigation/native';
import React, { useCallback } from 'react';
import { ScreenLayout, Button } from '../../../../components';
import {
    useAddReview,
    useGetTransactionByRentalId,
    useOpenTransaction,
} from '../../../../hooks';
import {
    AddReviewRequest,
    Transaction,
    TransactionDetailProps,
} from '../../../../types';
import { getStatusText, handleAxiosError } from '../../../../utils';
import {
    CompleteFlag,
    DocumentCard,
    ShipInformationCard,
    TransactionStatusCard,
} from './components';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { modalSlice, progressIndicatorSlice } from '../../../../slices';

const TransactionDetail: React.FC<TransactionDetailProps> = ({
    navigation,
    route,
}) => {
    const isFocused = useIsFocused();
    const dispatch = useDispatch();
    const { status, rentalId } = route.params;
    // console.log('status', status);
    // console.log('rentalId', rentalId);
    const mutationGetTransactionById = useGetTransactionByRentalId();
    const mutationOpenTransaction = useOpenTransaction();

    const mutationUseAddReview = useAddReview();
    const { showProgressIndicator, hideProgressIndicator } =
        progressIndicatorSlice.actions;
    const { hideModal, showModal } = modalSlice.actions;
    const [isShowAddReviewModal, setIsShowAddReviewModal] =
        React.useState(false);

    const [transaction, setTransaction] = React.useState<Transaction>();
    const { t } = useTranslation('common');
    const formattedShipSize = `${transaction?.ship.size.length} m x ${transaction?.ship.size.width} m x ${transaction?.ship.size.height} m`;
    const statusArray = transaction
        ? transaction.status
        : [{ name: 'rfq', desc: 'Request for Quote', isOpened: true }];
    const lastStatus = statusArray[statusArray.length - 1];
    const lastStatusText = getStatusText(lastStatus.name, t);
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
        lastStatus.name === 'proposal 1' &&
            navigation.navigate('Negotiate', {
                transactionId: transaction ? transaction._id : '',
                status: transaction?.status || [],
            });
        lastStatus.name === 'proposal 2' &&
            navigation.navigate('Negotiate', {
                transactionId: transaction ? transaction._id : '',
                status: transaction?.status || [],
            });
        lastStatus.name === 'proposal 3' &&
            navigation.navigate('PaymentReceipt', {
                paymentReceiptUrl: transaction
                    ? transaction.payment[transaction.payment.length - 1]
                          .receiptUrl
                    : '',
            });
        lastStatus.name === 'proposal 4' &&
            navigation.navigate('PaymentReceipt', {
                paymentReceiptUrl: transaction
                    ? transaction.payment[transaction.payment.length - 1]
                          .receiptUrl
                    : '',
            });
        // lastStatus.name === 'contract 1' &&
        //     navigation.navigate('ContractPreview', {
        //         contractUrl: transaction
        //             ? transaction.contract.contractUrl
        //             : '',
        //         rentalId,
        //     });
    };

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

    // console.log('Rental period: ', rentalPeriod);
    // console.log('Last status: ', lastStatus);
    // console.log('Ship ID: ', transaction?.ship.shipId._id);

    return (
        <ScreenLayout
            testId="TransactionDetailScreen"
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
            {lastStatus.name === 'complete' ? (
                <Button
                    title={t('AddReview.btnReview')}
                    onSubmit={() => {
                        navigation.navigate('AddReview', {
                            shipId: transaction
                                ? transaction?.ship.shipId._id
                                : '',
                        });
                    }}
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
                    lastStatus.isOpened === false &&
                    (lastStatus.name === 'proposal 1' ||
                        lastStatus.name === 'contract 1')
                }
                handleRespondPressed={handleRespondPressed}
                alertRespond={
                    (lastStatus.isOpened === true &&
                        lastStatus.name === 'proposal 1') ||
                    lastStatus.name === 'proposal 2'
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
                testId="documentCard"
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

export default TransactionDetail;
