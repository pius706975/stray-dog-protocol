import mime from 'mime';
import moment from 'moment';
import React from 'react';
import ImagePicker, { ImageOrVideo } from 'react-native-image-crop-picker';
import { View } from 'react-native-ui-lib';
import { useDispatch } from 'react-redux';
import { Button, ScreenLayout } from '../../../../components';
import {
    useGetTransactionByRentalId,
    useUploadPaymentReceipt,
} from '../../../../hooks';
import { modalSlice, progressIndicatorSlice } from '../../../../slices';
import { PaymentProps, Transaction } from '../../../../types';
import { handleAxiosError } from '../../../../utils';
import {
    HistoryCard,
    InstructionsAccordion,
    PaymentCD,
    SelectedImageAccordion,
    ShipOwnerAcc,
} from './components';
import { useTranslation } from 'react-i18next';
import { FCMTOKEN, getDataFromLocalStorage } from '../../../../configs';
import { useIsFocused } from '@react-navigation/native';

const Payment: React.FC<PaymentProps> = ({ navigation, route }) => {
    const { rentalId, transactionId } = route.params;
    const dispatch = useDispatch();
    const { hideModal, showModal } = modalSlice.actions;
    const { showProgressIndicator, hideProgressIndicator } =
        progressIndicatorSlice.actions;
    const { t } = useTranslation('payment');
    const mutationGetTransactionById = useGetTransactionByRentalId();
    const mutationUploadPaymentReceipt = useUploadPaymentReceipt();
    const [transaction, setTransaction] = React.useState<Transaction>();
    const [selectedImage, setSelectedImage] = React.useState<ImageOrVideo>();
    const [offeredPrice, setOfferedPrice] = React.useState<number>(200000);
    const [rentStartDate, setRentStartDate] = React.useState<Date>();
    const [rentEndDate, setRentEndDate] = React.useState<Date>();
    const [token, setToken] = React.useState<string>('');
    const currentDate = moment(Date.now());
    const expireDate = moment(
        transaction?.payment[transaction.payment.length - 1].paymentExpiredDate,
    );
    const timeLeft = expireDate.diff(currentDate, 'seconds');
    const isFocused = useIsFocused();

    const formData = new FormData();

    const handleOpenImage = async () => {
        try {
            const image = await ImagePicker.openPicker({
                width: 300,
                height: 400,
                cropping: true,
                mediaType: 'photo',
            });

            setSelectedImage(image);
            console.log(selectedImage);
        } catch (error) {
            console.log('Error selecting Image', error);
        }
    };

    const handleSendReceipt = () => {
        dispatch(showProgressIndicator());
        formData.append('rentalId', rentalId);
        formData.append('token', token);
        formData.append('image', {
            uri: selectedImage?.path,
            type: mime.getType(selectedImage?.path),
            name: `${rentalId} payment receipt`,
        });
        mutationUploadPaymentReceipt.mutate(formData, {
            onSuccess: () => {
                dispatch(
                    showModal({
                        status: 'success',
                        text: t('successSentPaymentReceipt'),
                    }),
                );
                setTimeout(() => {
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'MainScreenTab' }],
                    });
                    dispatch(hideModal());
                    dispatch(hideProgressIndicator());
                }, 3000);
            },
            onError: err => {
                dispatch(
                    showModal({
                        status: 'failed',
                        text: t('failedSentPaymentReceipt'),
                    }),
                );
                setTimeout(() => {
                    dispatch(hideModal());
                    dispatch(hideProgressIndicator());
                }, 3000);
                handleAxiosError(err);
            },
        });
    };

    React.useEffect(() => {
        if (isFocused) {
            getDataFromLocalStorage(FCMTOKEN).then(resp => {
                setToken(resp);
            });
            mutationGetTransactionById.mutate(rentalId, {
                onSuccess: resp => {
                    setTransaction(resp.data.data);
                    setOfferedPrice(resp.data.data.offeredPrice);
                    setRentStartDate(resp.data.data.rentalStartDate);
                    setRentEndDate(resp.data.data.rentalEndDate);
                },
                onError: err => {
                    handleAxiosError(err);
                },
            });
        }
    }, [isFocused]);

    const instructionsAccordion = [
        'instructions-accordion-1',
        'instructions-accordion-2',
        'instructions-accordion-3',
    ];

    return (
        <ScreenLayout
            testId="PaymentScreen"
            backgroundColor="light"
            padding={10}>
            <View
                style={{
                    gap: 10,
                }}>
                <PaymentCD
                    payIn={timeLeft}
                    offeredPrice={offeredPrice}
                    rentStartDate={rentStartDate ?? new Date()}
                    rentEndDate={rentEndDate ?? new Date()}
                />
                {transaction && transaction.payment.length > 1 && (
                    <>
                        <HistoryCard
                            navigation={navigation}
                            rentalId={rentalId}
                        />
                    </>
                )}
                {selectedImage && (
                    <SelectedImageAccordion
                        testID="selected-image-accordion"
                        handleOpenImage={handleOpenImage}
                        handleSendReceipt={handleSendReceipt}
                        selectedImagePath={selectedImage.path}
                        isSubmittingSendReceipt={
                            mutationUploadPaymentReceipt.isLoading
                        }
                    />
                )}
                <ShipOwnerAcc transactionId={transactionId} />
                <InstructionsAccordion testID={instructionsAccordion} />
            </View>
            {!selectedImage && (
                <View
                    style={{
                        position: 'absolute',
                        bottom: 30,
                        right: 20,
                    }}>
                    <Button
                        title={t('btnUploadPayment')}
                        color="success"
                        onSubmit={handleOpenImage}
                    />
                </View>
            )}
        </ScreenLayout>
    );
};

export default Payment;
