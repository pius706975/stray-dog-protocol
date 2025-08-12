import React, { useRef, useState, useCallback, useMemo } from 'react';
import { ScrollView } from 'react-native';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useIsFocused } from '@react-navigation/native';
import moment from 'moment';
import BottomSheet from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheet/BottomSheet';

import {
    ShipPictures,
    ShipTrackingDetailProps,
    Transaction,
} from '../../../../types';
import {
    Button,
    ConfirmationModal,
    RentInformation,
    ScreenLayout,
    ShipInformation,
    ShipPicturesModal,
    TrackHistory,
    UpdateStatusCard,
} from '../../../../components';
import {
    useGetTransactionByRentalId,
    useUpdateRenterShipTracking,
} from '../../../../hooks';
import { handleAxiosError } from '../../../../utils';
import { modalSlice, progressIndicatorSlice } from '../../../../slices';

const ShipTrackingDetail: React.FC<ShipTrackingDetailProps> = ({
    navigation,
    route,
}) => {
    const { t } = useTranslation('shiptracking');

    const { rentalId } = route.params;
    const { hideModal, showModal } = modalSlice.actions;
    const { showProgressIndicator, hideProgressIndicator } =
        progressIndicatorSlice.actions;

    const sheetRef = useRef<BottomSheet>(null);
    const scrollViewRef = useRef<ScrollView>(null);

    const isFocused = useIsFocused();
    const dispatch = useDispatch();

    const mutationGetTransactionById = useGetTransactionByRentalId();
    const mutationUseUpdateShipTracking = useUpdateRenterShipTracking();

    const [transaction, setTransaction] = useState<Transaction>();
    const [isShowConfirmModal, setIsShowConfirmModal] = useState(false);
    const [isShowShipPictureModal, setIsShowShipPictureModal] = useState(false);
    const [shipPictures, setShipPictures] = useState<ShipPictures>([]);

    const scrollTrackHistoryToTop = useCallback(() => {
        if (scrollViewRef.current) {
            scrollViewRef.current.scrollTo({ y: 0, animated: true });
        }
    }, []);

    const handleGetTransactionById = useCallback(() => {
        scrollTrackHistoryToTop();
        mutationGetTransactionById.mutate(rentalId, {
            onSuccess: resp => {
                setTransaction(resp.data.data);
            },
            onError: err => {
                handleAxiosError(err);
            },
        });
    }, [rentalId, scrollTrackHistoryToTop, mutationGetTransactionById]);

    const handleReturnShip = useCallback(() => {
        dispatch(showProgressIndicator());

        const formData = new FormData();
        formData.append('status', 'returning');
        formData.append(
            'desc',
            `${transaction?.ship?.name} sedang kembali dari pelayaran`,
        );
        formData.append('date', moment().format('DD-MM-YYYY'));
        formData.append('time', moment().format('HH:mm'));

        mutationUseUpdateShipTracking.mutate(
            { request: formData, rentalId },
            {
                onSuccess: _ => {
                    dispatch(
                        showModal({
                            status: 'success',
                            text: t(
                                'ShipTrackingDetail.textSuccessStatusUpdate',
                            ),
                        }),
                    );
                    setTimeout(() => {
                        dispatch(hideModal());
                    }, 4000);
                    handleGetTransactionById();
                },
                onError: err => {
                    handleAxiosError(err);
                },
                onSettled: () => {
                    dispatch(hideProgressIndicator());
                },
            },
        );

        setIsShowConfirmModal(false);
    }, [
        transaction?.ship?.name,
        rentalId,
        dispatch,
        showProgressIndicator,
        hideProgressIndicator,
        showModal,
        hideModal,
        t,
        mutationUseUpdateShipTracking,
        handleGetTransactionById,
    ]);

    React.useEffect(() => {
        if (isFocused) {
            handleGetTransactionById();
        }
    }, [isFocused]);

    const shipTrackingHistory = useMemo(
        () => transaction?.sailingStatus,
        [transaction?.sailingStatus],
    );

    const latestShipTrackingHistory = useMemo(
        () =>
            shipTrackingHistory
                ? shipTrackingHistory[shipTrackingHistory.length - 1]
                : null,
        [shipTrackingHistory],
    );

    return (
        <ScreenLayout
            testId="shipTrackingDetailsScreen"
            backgroundColor="light"
            padding={10}
            gap={10}>
            <ShipInformation
                shipName={transaction?.ship?.name}
                shipDestination={transaction?.locationDestination}
                shipDeparture={transaction?.locationDeparture}
                shipImageUrl={transaction?.ship?.imageUrl}
                shipCompanyName={transaction?.ship?.companyName}
                shipCompanyType={transaction?.ship?.companyType}
                onRenterBtnPress={() => {
                    sheetRef.current?.expand();
                }}
            />
            <UpdateStatusCard
                latestShipTrackingStatus={latestShipTrackingHistory?.status}
                handlePress={(_: string) => {
                    navigation.navigate('ShipTrackingForm', {
                        rentalId,
                    });
                }}
            />
            <TrackHistory
                scrollViewRef={scrollViewRef}
                rentalId={rentalId}
                sailingStatus={shipTrackingHistory}
                beforeSailingPictures={transaction?.beforeSailingPictures}
                afterSailingPictures={transaction?.afterSailingPictures}
                handlePress={useCallback(shipPictures => {
                    setShipPictures(shipPictures);
                    setIsShowShipPictureModal(true);
                }, [])}
                latestShipTrackingStatus={latestShipTrackingHistory?.status}
            />
            <ConfirmationModal
                testID="shipTrackingConfirmModal"
                isVisible={isShowConfirmModal}
                onConfirm={handleReturnShip}
                onCancel={() => {
                    setIsShowConfirmModal(false);
                }}
            />
            <ShipPicturesModal
                testID="shipTrackingPictureModal"
                isVisible={isShowShipPictureModal}
                shipPictures={shipPictures}
                onCloseModal={() => {
                    setIsShowShipPictureModal(false);
                }}
            />
            {latestShipTrackingHistory?.status === 'sailing' && (
                <Button
                    title={t('ShipTrackingDetail.textReturnShipButton')}
                    color="error"
                    onSubmit={() => {
                        setIsShowConfirmModal(true);
                    }}
                />
            )}
            <RentInformation
                sheetRef={sheetRef}
                departureLocation={transaction?.locationDeparture}
                destinationLocation={transaction?.locationDestination}
                rentType={transaction?.shipRentType}
                rentDuration={transaction?.rentalDuration}
                startDate={transaction?.rentalStartDate}
                endDate={transaction?.rentalEndDate}
            />
        </ScreenLayout>
    );
};

export default ShipTrackingDetail;
