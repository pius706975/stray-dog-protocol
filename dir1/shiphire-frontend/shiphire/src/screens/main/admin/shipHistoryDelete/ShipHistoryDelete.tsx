import React from 'react';
import { View } from 'react-native-ui-lib';
import { ShipDatas, ShipHistoryDeleteProps } from '../../../../types';
import {
    useApproveDeleteShipHistory,
    useGetAllShipsHistoryPending,
} from '../../../../hooks';
import { Button, CustomText } from '../../../../components';
import { FlatList } from 'react-native-gesture-handler';
import { ConfirmModal } from './components';
import { useDispatch } from 'react-redux';
import { modalSlice } from '../../../../slices';
import { useIsFocused } from '@react-navigation/native';

const ShipHistoryDelete: React.FC<ShipHistoryDeleteProps> = () => {
    const [shipHistoryPending, setShipHistoryPending] =
        React.useState<ShipDatas[]>();
    const mutationGetShipHistoryPending = useGetAllShipsHistoryPending();
    const mutationApproveDeleteShipHistory = useApproveDeleteShipHistory();
    const dispatch = useDispatch();
    const { hideModal, showModal } = modalSlice.actions;
    const [showConfirmationModal, setShowConfirmationModal] =
        React.useState(false);
    const [selectedShipHistoryId, setSelectedShipHistoryId] =
        React.useState(null);
    const isFocused = useIsFocused();

    React.useEffect(() => {
        if (isFocused) {
            mutationGetShipHistoryPending.mutate(undefined, {
                onSuccess: resp => {
                    setShipHistoryPending(resp.data.data);
                },
            });
        }
    }, [isFocused]);

    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            timeZone: 'UTC', // Set the time zone to UTC
        };
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', options);
    };

    const handleConfirmApprove = () => {
        if (!selectedShipHistoryId) {
            console.error('No ship history id selected');
            return;
        }

        mutationApproveDeleteShipHistory.mutate(
            { id: selectedShipHistoryId },
            {
                onSuccess: resp => {
                    dispatch(
                        showModal({
                            status: 'success',
                            text: 'Approve Delete Ship History Success',
                        }),
                    );
                    setTimeout(() => {
                        dispatch(hideModal());
                    }, 4000);
                    mutationGetShipHistoryPending.mutate(undefined, {
                        onSuccess: resp => {
                            setShipHistoryPending(resp.data.data);
                        },
                    });
                },
                onError: err => {
                    console.error(err);
                },
            },
        );

        setShowConfirmationModal(false);
    };

    const handleCancelDelete = () => {
        setShowConfirmationModal(false);
    };

    const renderItem = ({ item, index }) => {
        const approveDeleteShipHistory = id => {
            setSelectedShipHistoryId(id);
            setShowConfirmationModal(true);
        };
        return (
            <View
                style={{
                    flexDirection: 'row',
                    borderBottomWidth: 0.5,
                }}>
                <View
                    style={{
                        paddingVertical: 14,
                        paddingRight: 10,
                        flex: 1,
                        paddingLeft: 14,
                    }}>
                    <CustomText
                        fontSize="xs"
                        fontFamily="semiBold"
                        color="darkTextColor">
                        Ship Name:
                    </CustomText>
                    <CustomText
                        fontSize="xs"
                        fontFamily="regular"
                        color="darkTextColor">
                        {item.shipId.name}
                    </CustomText>
                    <CustomText
                        fontSize="xs"
                        fontFamily="semiBold"
                        color="darkTextColor">
                        Rent Period:
                    </CustomText>
                    <CustomText
                        fontSize="xs"
                        fontFamily="regular"
                        color="darkTextColor">
                        {formatDate(item.rentStartDate)} to{' '}
                        {formatDate(item.rentEndDate)}
                    </CustomText>
                    <CustomText
                        fontSize="xs"
                        fontFamily="semiBold"
                        color="darkTextColor">
                        Location:
                    </CustomText>
                    <CustomText
                        fontSize="xs"
                        fontFamily="regular"
                        color="darkTextColor">
                        {item.locationDeparture} to {item.locationDestination}
                    </CustomText>
                    {item.deleteStatus === 'pending' ? (
                        <View>
                            <CustomText
                                fontSize="xs"
                                fontFamily="semiBold"
                                color="darkTextColor">
                                Status:
                            </CustomText>
                            <CustomText
                                fontSize="xs"
                                fontFamily="regular"
                                color="boldErrorColor">
                                Waiting for Delete Approval
                            </CustomText>
                        </View>
                    ) : null}
                </View>
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}>
                    <View marginR-5>
                        <Button
                            testID={`item-${index}`}
                            title="Approve"
                            color="success"
                            onSubmit={() => approveDeleteShipHistory(item._id)}
                        />
                    </View>
                </View>
            </View>
        );
    };
    return (
        <View>
            <FlatList
                style={{ width: '100%', height: '100%' }}
                data={['']}
                keyExtractor={() => 'dummyKey'}
                showsVerticalScrollIndicator={false}
                renderItem={() => (
                    <View
                        style={{
                            margin: 6,
                            borderRadius: 8,
                            height: '100%',
                        }}>
                        <>
                            <FlatList
                                testID="shipHistoryData"
                                ItemSeparatorComponent={() => <View />}
                                data={shipHistoryPending}
                                renderItem={renderItem}
                                keyExtractor={item => item._id}
                                onEndReachedThreshold={0.1}
                            />
                        </>
                    </View>
                )}
            />
            <ConfirmModal
                isVisible={showConfirmationModal}
                onConfirm={handleConfirmApprove}
                onCancel={handleCancelDelete}
            />
        </View>
    );
};

export default ShipHistoryDelete;
