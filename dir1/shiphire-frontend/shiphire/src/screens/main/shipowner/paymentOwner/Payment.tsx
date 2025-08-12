import React from 'react';
import { View } from 'react-native-ui-lib';
import { useDispatch } from 'react-redux';
import { Button, ScreenLayout } from '../../../../components';
import { useAcceptPayment } from '../../../../hooks';
import { modalSlice, progressIndicatorSlice } from '../../../../slices';
import { PaymentOwnerProps } from '../../../../types';
import { handleAxiosError } from '../../../../utils';
import { PaymentReceiptPreview } from '../paymentReceiptOwner';
import { HistoryCard } from './components';
import { useTranslation } from 'react-i18next';

const Payment: React.FC<PaymentOwnerProps> = ({ route, navigation }) => {
    const {
        rentalId,
        paymentReceiptUrl,
        sailingStatus,
        beforeSailingPictures,
        payment,
        rentType,
        lastStatus
    } = route.params;

    const dispatch = useDispatch();
    const { hideModal, showModal } = modalSlice.actions;
    const { showProgressIndicator, hideProgressIndicator } =
        progressIndicatorSlice.actions;
    const mutationAcceptPayment = useAcceptPayment();
    const { t } = useTranslation('common')

    const handleSendReceipt = () => {
        dispatch(showProgressIndicator());
        // ! Commented out because of the new flow with the ship tracking history
        // if (beforeSailingPictures.length < 1) {
        // setTimeout(() => {
        //     dispatch(
        //         showModal({
        //             status: 'failed',
        //             text: t('AcceptPaymentStats.textUploadPictures'),
        //         }),
        //     );
        // }, 1000);
        // setTimeout(() => {
        //     navigation.navigate('ShipOwnerTransactionDetail', {
        //         status: 'payment',
        //         rentalId: rentalId,
        //     });
        //     dispatch(hideModal());
        //     dispatch(hideProgressIndicator());
        // }, 4000);
        // return;
        // }
        mutationAcceptPayment.mutate(
            { rentalId },
            {
                onSuccess: () => {
                    dispatch(
                        showModal({
                            status: 'success',
                            text: t('AcceptPaymentStats.textSuccessAcceptPayment'),
                        }),
                    );
                    setTimeout(() => {
                        // ! Commented out because of the new flow with the ship tracking history
                        // navigation.navigate('OwnerTransactionTabNav');
                        navigation.navigate('ShipOwnerTransactionDetail', {
                            status: 'payment',
                            rentalId: rentalId,
                        });
                        dispatch(hideModal());
                        dispatch(hideProgressIndicator());
                    }, 3000);
                },
                onError: err => {
                    dispatch(
                        showModal({
                            status: 'failed',
                            text: t('AcceptPaymentStats.textFailedAcceptPayment'),
                        }),
                    );
                    setTimeout(() => {
                        dispatch(hideModal());
                        dispatch(hideProgressIndicator());
                    }, 3000);
                    handleAxiosError(err);
                },
            },
        );
    };
    console.log(rentType);

    return (
        <ScreenLayout
            testId="PaymentOwnerScreen"
            backgroundColor="light"
            padding={10}>
            <HistoryCard
                navigation={navigation}
                payment={payment}
                rentType={rentType}
            />

            <PaymentReceiptPreview url={paymentReceiptUrl as string} />

            <View
                style={{
                    position: 'absolute',
                    bottom: 30,
                    right: 20,
                }}>
                {lastStatus !== 'payment 3' && (
                    <Button
                        title={t('AcceptPaymentStats.btnAcceptPayment')}
                        color="success"
                        onSubmit={handleSendReceipt}
                    />
                )}
            </View>
        </ScreenLayout>
    );
};

export default Payment;
