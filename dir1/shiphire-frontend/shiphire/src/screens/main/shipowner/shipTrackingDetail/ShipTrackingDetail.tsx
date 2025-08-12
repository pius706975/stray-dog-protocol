import React, { useRef, useState, useCallback, useMemo } from 'react';
import { ScrollView } from 'react-native';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useIsFocused } from '@react-navigation/native';
import moment from 'moment';

import {
    OwnerShipTrackingDetailProps,
    ShipPictures,
    Transaction,
} from '../../../../types';
import {
    ScreenLayout,
    ConfirmationModal,
    ShipInformation,
    ShipPicturesModal,
    TrackHistory,
    UpdateStatusCard,
} from '../../../../components';
import {
    useGetTransactionById,
    useUpdateShipTracking,
} from '../../../../hooks';
import { handleAxiosError } from '../../../../utils';
import { modalSlice, progressIndicatorSlice } from '../../../../slices';

const ShipTrackingDetail: React.FC<OwnerShipTrackingDetailProps> = ({
    navigation,
    route,
}) => {
    const { t } = useTranslation('shiptracking');

    const { rentalId } = route.params;
    const { hideModal, showModal } = modalSlice.actions;
    const { showProgressIndicator, hideProgressIndicator } =
        progressIndicatorSlice.actions;

    const scrollViewRef = useRef<ScrollView>(null);

    const isFocused = useIsFocused();
    const dispatch = useDispatch();

    const mutationGetTransactionById = useGetTransactionById();
    const mutationUseUpdateShipTracking = useUpdateShipTracking();

    const [transaction, setTransaction] = useState<Transaction>();
    const [isShowConfirmModal, setIsShowConfirmModal] = useState(false);
    const [isShowShipPictureModal, setIsShowShipPictureModal] = useState(false);
    const [shipPictures, setShipPictures] = useState<ShipPictures>([]);
    const [nextStatus, setNextStatus] = useState('');

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

    const handleUpdateShipTrackingStatus = useCallback(() => {
        dispatch(showProgressIndicator());
        const payload = {
            rentalId: rentalId,
            status: nextStatus,
            date: moment().format('DD/MM/YYYY'),
            time: moment().format('HH:mm'),
        };

        mutationUseUpdateShipTracking.mutate(payload, {
            onSuccess: _ => {
                if (nextStatus === 'afterSailing') {
                    dispatch(
                        showModal({
                            status: 'success',
                            text: t(
                                'ShipTrackingDetail.textSuccessStatusUpdateDocked',
                            ),
                        }),
                    );

                    navigation.navigate('ShipOwnerTransactionDetail', {
                        status: 'sailing',
                        rentalId,
                    });
                } else {
                    dispatch(
                        showModal({
                            status: 'success',
                            text: t(
                                'ShipTrackingDetail.textSuccessStatusUpdate',
                            ),
                        }),
                    );
                }
                setTimeout(() => {
                    dispatch(hideModal());
                }, 4000);
                handleGetTransactionById();
            },
            onError: err => {
                handleAxiosError(err);
            },
            onSettled: () => {
                setIsShowConfirmModal(false);
                dispatch(hideProgressIndicator());
            },
        });
    }, [
        rentalId,
        nextStatus,
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
            />
            <UpdateStatusCard
                latestShipTrackingStatus={latestShipTrackingHistory?.status}
                handlePress={(nextStatus: string) => {
                    setIsShowConfirmModal(true);
                    setNextStatus(nextStatus);
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
                onConfirm={handleUpdateShipTrackingStatus}
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
        </ScreenLayout>
    );
};

export default ShipTrackingDetail;
