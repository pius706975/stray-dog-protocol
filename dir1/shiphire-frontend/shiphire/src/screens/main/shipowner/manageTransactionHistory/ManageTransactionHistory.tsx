import React from 'react';
import { View, Text } from 'react-native-ui-lib';
import { ManageTransactionHistoryProps } from '../../../../types';
import { FlatList } from 'react-native-gesture-handler';
import { Pressable, useWindowDimensions } from 'react-native';
import { Button, CustomText } from '../../../../components';
import {
    Color,
    DocumentIcon,
    DocumentIconWhite,
    DownloadIcon,
} from '../../../../configs';
import {
    useDeleteShipHistory,
    useEditShipHistory,
    useGetShipById,
} from '../../../../hooks';
import { useDispatch } from 'react-redux';
import { modalSlice } from '../../../../slices';
import { ConfirmModal, ModalPdf } from './components';
import EditShipHistory from './EditShipHistory';
import moment from 'moment';
import { useTranslation } from 'react-i18next';

type AdditionalDocument = {
    id: number;
    name: string;
    uri: string;
    type: string;
};

const ManageTransactionHistory: React.FC<ManageTransactionHistoryProps> = ({
    navigation,
    route,
}) => {
    const { shipId } = route.params;
    const [shipHistory, setShipHistory] = React.useState(
        route.params.shipHistory,
    );
    const { t } = useTranslation('detailship');

    const dispatch = useDispatch();
    const [visiblePdf, setVisiblePdf] = React.useState<boolean>(false);
    const { hideModal, showModal } = modalSlice.actions;
    const mutationGetShipById = useGetShipById();
    const mutationDeleteShipHistory = useDeleteShipHistory();
    const [showConfirmationModal, setShowConfirmationModal] =
        React.useState(false);
    const [selectedShipHistoryId, setSelectedShipHistoryId] =
        React.useState(null);
    const [selectedDocument, setSelectedDocument] =
        React.useState<AdditionalDocument>({
            id: 0,
            name: '',
            uri: '',
            type: '',
        });
    React.useEffect(() => {
        // Update the shipHistory state when route.params changes

        setShipHistory(route.params.shipHistory);
    }, [route.params.shipHistory]);

    const handleShowModalPdf = () => {
        setVisiblePdf(!visiblePdf);
    };

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

    const handleConfirmDelete = () => {
        if (!selectedShipHistoryId) {
            console.error('No ship history id selected');
            return;
        }

        mutationDeleteShipHistory.mutate(
            { id: selectedShipHistoryId },
            {
                onSuccess: resp => {
                    dispatch(
                        showModal({
                            status: 'success',
                            text: t(
                                'ShipOwner.ManageTransactionHistory.successDelete',
                            ),
                        }),
                    );
                    setTimeout(() => {
                        dispatch(hideModal());
                    }, 4000);
                    mutationGetShipById.mutate(shipId, {
                        onSuccess: resp => {
                            setShipHistory(resp.data.data.shipHistory);
                        },
                        onError: err => {
                            console.log(err);
                        },
                    });
                },
                onError: err => {
                    dispatch(
                        showModal({
                            status: 'failed',
                            text: t(
                                'ShipOwner.ManageTransactionHistory.errorDelete',
                            ),
                        }),
                    );
                    setTimeout(() => {
                        dispatch(hideModal());
                    }, 4000);
                },
            },
        );
        setShowConfirmationModal(false);
    };

    const handleEdit = item => {
        navigation.navigate('EditShipHistory', {
            shipHistory: item,
        });
    };

    const handleCancelDelete = () => {
        setShowConfirmationModal(false);
    };

    const renderItem = ({ item }) => {
        console.log('item', item);
        const deleteShipHistory = id => {
            setSelectedShipHistoryId(id);
            setShowConfirmationModal(true);
        };
        if (item.deleteStatus === 'approved') {
            return null;
        }
        return (
            <View
                testID="transaction-history-item"
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
                        {t('ShipOwner.ManageTransactionHistory.textRentPeriod')}
                    </CustomText>
                    <CustomText
                        fontSize="xs"
                        fontFamily="regular"
                        color="darkTextColor">
                        {formatDate(item.rentStartDate)}{' '}
                        {t('ShipOwner.ManageTransactionHistory.textUntil')}{' '}
                        {formatDate(item.rentEndDate)}
                    </CustomText>
                    <CustomText
                        fontSize="xs"
                        fontFamily="semiBold"
                        color="darkTextColor">
                        {t('ShipOwner.ManageTransactionHistory.textLocation')}
                    </CustomText>
                    <CustomText
                        fontSize="xs"
                        fontFamily="regular"
                        color="darkTextColor">
                        {item.locationDeparture}{' '}
                        {t('ShipOwner.ManageTransactionHistory.textTo')}{' '}
                        {item.locationDestination}
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
                                {t(
                                    'ShipOwner.ManageTransactionHistory.textWaiting',
                                )}
                            </CustomText>
                        </View>
                    ) : null}
                    <View row style={{ flexWrap: 'wrap', flex: 1 }}>
                        {item.genericDocument.map((doc, index) => {
                            return (
                                <Pressable
                                    key={index}
                                    onPress={() => {
                                        handleShowModalPdf();
                                        setSelectedDocument({
                                            id: index,
                                            name: doc.fileName,
                                            uri: doc.fileUrl,
                                            type: 'application/pdf',
                                        });
                                    }}
                                    style={{
                                        flexDirection: 'row',
                                        backgroundColor: Color.primaryColor,
                                        padding: 5,
                                        paddingHorizontal: 8,
                                        borderRadius: 5,
                                        marginTop: 5,
                                        marginRight: 5,
                                    }}>
                                    <View marginR-5>
                                        <DocumentIconWhite />
                                    </View>
                                    <CustomText
                                        color="lightTextColor"
                                        fontFamily="regular"
                                        fontSize="xs">
                                        {doc.fileName}
                                    </CustomText>
                                </Pressable>
                            );
                        })}
                    </View>
                </View>
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}>
                    {item.deleteStatus === 'pending' ? (
                        <View marginR-5>
                            <Button
                                title={t(
                                    'ShipOwner.ManageTransactionHistory.buttonEdit',
                                )}
                                disable
                                onSubmit={() => {}}
                            />
                        </View>
                    ) : (
                        <View marginR-5>
                            <Button
                                testID="edit-transaction-history"
                                title={t(
                                    'ShipOwner.ManageTransactionHistory.buttonEdit',
                                )}
                                color="success"
                                onSubmit={() => {
                                    handleEdit(item);
                                }}
                            />
                        </View>
                    )}

                    {item.deleteStatus === 'pending' ? (
                        <View marginR-5>
                            <Button
                                title={t(
                                    'ShipOwner.ManageTransactionHistory.buttonDelete',
                                )}
                                disable
                                onSubmit={() => {}}
                            />
                        </View>
                    ) : (
                        <View marginR-5>
                            <Button
                                testID="delete-transaction-history"
                                title={t(
                                    'ShipOwner.ManageTransactionHistory.buttonDelete',
                                )}
                                color="error"
                                onSubmit={() => deleteShipHistory(item._id)}
                            />
                        </View>
                    )}
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
                                testID="transaction-history-list"
                                ItemSeparatorComponent={() => <View />}
                                data={shipHistory}
                                renderItem={renderItem}
                                keyExtractor={item => item._id}
                                onEndReachedThreshold={0.1}
                            />
                        </>
                    </View>
                )}
            />
            <ConfirmModal
                testID="confirm-modal-delete"
                isVisible={showConfirmationModal}
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
            />
            <ModalPdf
                visible={visiblePdf}
                onClose={handleShowModalPdf}
                selectedDocument={selectedDocument}
            />
        </View>
    );
};

export default ManageTransactionHistory;
