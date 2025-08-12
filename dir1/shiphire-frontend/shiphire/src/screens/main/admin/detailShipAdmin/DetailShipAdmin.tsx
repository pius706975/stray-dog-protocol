import BottomSheet from '@gorhom/bottom-sheet';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, useWindowDimensions } from 'react-native';
import { Badge, Image, Modal, View } from 'react-native-ui-lib';
import { useDispatch } from 'react-redux';
import {
    Button,
    CategoryContainer,
    CustomText,
    ScreenLayout,
} from '../../../../components';
import {
    CheckIcon,
    CloseIcon,
    Color,
    PlusIcon,
    RightIcon,
} from '../../../../configs';
import {
    useApproveShip,
    useGetShipById,
    useUnapproveShip,
} from '../../../../hooks';
import { modalSlice, progressIndicatorSlice } from '../../../../slices';
import {
    AdditionalDocument,
    DetailShipsAdminProps,
    ShipDatas,
} from '../../../../types';
import { DetailShipProfile, DetailShipSheet, ModalPdf } from './components';
import { handleAxiosError } from '../../../../utils';
import { useIsFocused } from '@react-navigation/native';

const DetailShipAdmin: React.FC<DetailShipsAdminProps> = ({
    navigation,
    route,
}) => {
    const mutationGetShipById = useGetShipById();
    const mutationApprovedShip = useApproveShip();
    const mutationUnapprovedShip = useUnapproveShip();
    const { hideModal, showModal } = modalSlice.actions;
    const { height } = useWindowDimensions();
    const { shipId } = route.params;
    const { t } = useTranslation('detailship');
    const [shipData, setShipData] = React.useState<ShipDatas>();
    const formattedPrice = shipData?.pricePerMonth.toLocaleString('id-ID');
    const sheetRef = React.useRef<BottomSheet>(null);
    const snapPoints = React.useMemo(() => ['45%'], []);
    const [showConfirmationModal, setShowConfirmationModal] =
        React.useState(false);
    const [showUnapproveModal, setShowUnapproveModal] = React.useState(false);
    const [visiblePdf, setVisiblePdf] = React.useState<boolean>(false);
    const isFocused = useIsFocused();

    const dispatch = useDispatch();
    const { showProgressIndicator, hideProgressIndicator } =
        progressIndicatorSlice.actions;

    const handleSnapPress = React.useCallback((index: number) => {
        sheetRef.current?.snapToIndex(index);
    }, []);
    const handleClosePress = React.useCallback(() => {
        sheetRef.current?.close();
    }, []);

    const onPressApproval = () => {
        setShowConfirmationModal(true);
    };

    const onPressUnapproval = () => {
        setShowUnapproveModal(true);
    };

    const handleShowModalPdf = () => {
        setVisiblePdf(!visiblePdf);
    };

    const [selectedDocument, setSelectedDocument] =
        React.useState<AdditionalDocument>({
            id: 0,
            name: '',
            uri: '',
            type: '',
        });

    const handleDocumentPress = item => {
        setSelectedDocument({
            id: item._id,
            name: item.documentName,
            uri: item.documentUrl,
            type: 'application/pdf',
        });
        handleShowModalPdf();
    };

    const confirmApproval = (approve: boolean) => {
        dispatch(showProgressIndicator());
        mutationApprovedShip.mutate(
            { _id: shipId },
            {
                onSuccess: () => {
                    dispatch(
                        showModal({
                            status: 'success',
                            text: 'Ship has been approved',
                        }),
                    );
                    setTimeout(() => {
                        navigation.navigate('ShipManagement');
                        dispatch(hideModal());
                        dispatch(hideProgressIndicator());
                    }, 3000);
                },
                onError: err => {
                    dispatch(
                        showModal({
                            status: 'failed',
                            text: 'fail to approve',
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
        setShowConfirmationModal(false);
    };

    const confirmUnapproval = (approve: boolean) => {
        dispatch(showProgressIndicator());
        mutationUnapprovedShip.mutate(
            { _id: shipId },
            {
                onSuccess: () => {
                    dispatch(
                        showModal({
                            status: 'success',
                            text: 'Ship has been unapproved',
                        }),
                    );
                    setTimeout(() => {
                        navigation.navigate('ShipManagement');
                        dispatch(hideModal());
                        dispatch(hideProgressIndicator());
                    }, 3000);
                },
                onError: err => {
                    dispatch(
                        showModal({
                            status: 'failed',
                            text: 'fail to unapproved',
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
        setShowUnapproveModal(false);
    };

    React.useEffect(() => {
        if (isFocused) {
            dispatch(showProgressIndicator());

            mutationGetShipById.mutate(shipId, {
                onSuccess: resp => {
                    setTimeout(() => {
                        dispatch(hideProgressIndicator());
                    }, 2000);
                    setShipData(resp.data.data);
                    dispatch(hideProgressIndicator());
                },
            });
            dispatch(showProgressIndicator());
        }
    }, [isFocused]);

    const convertCamelCase = (input: string): string => {
        const lastWord = input.split(' ').pop() || '';

        const converted = lastWord
            .replace(/([a-z])([A-Z0-9])/g, '$1 $2')
            .toLowerCase();

        // Capitalize each word
        const capitalized = converted
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');

        return capitalized;
    };

    return (
        <>
            <ScreenLayout testId="DetailShipScreen" backgroundColor="light">
                {shipData?.imageUrl ? (
                    <View>
                        <Image
                            source={{ uri: `${shipData.imageUrl}` }}
                            style={{
                                height: height / 3,
                                width: '100%',
                            }}
                        />
                        {shipData?.shipApproved && (
                            <Badge
                                label="Approved ✔"
                                labelStyle={{
                                    fontSize: 15,
                                    fontWeight: 'bold',
                                }}
                                backgroundColor={Color.primaryColor}
                                style={{
                                    position: 'absolute',
                                    bottom: 10,
                                    right: 10,
                                }}
                            />
                        )}
                    </View>
                ) : null}

                <View flex padding-10>
                    <View
                        style={{
                            paddingBottom: 10,
                        }}>
                        <DetailShipProfile
                            shipName={shipData?.name}
                            shipPrice={formattedPrice}
                            shipRating={shipData?.rating}
                            shipRented={shipData?.totalRentalCount}
                            shipCategory={shipData?.category.name}
                        />
                    </View>
                    <View
                        paddingB-20
                        style={{
                            borderBottomWidth: 0.6,
                        }}>
                        <CustomText
                            fontFamily="semiBold"
                            fontSize="xl"
                            color="primaryColor">
                            {t('DetailShipProfile.textDescription')}
                        </CustomText>
                        <CustomText
                            fontFamily="regular"
                            fontSize="md"
                            color="darkTextColor"
                            lineHeight={22}>
                            {shipData?.desc}
                        </CustomText>
                    </View>
                    <View
                        style={{
                            borderBottomWidth: 0.6,
                        }}>
                        <View paddingB-20>
                            <CustomText
                                fontFamily="semiBold"
                                fontSize="xl"
                                color="primaryColor">
                                {/* {t('textVisitCompany')} */}
                                {t(
                                    'ShipOwner.AddTransactionHistory.textDocumentList',
                                )}
                            </CustomText>
                            <View
                                row
                                marginT-10
                                style={{
                                    rowGap: 10,
                                    flexWrap: 'wrap',
                                }}>
                                {shipData?.shipDocuments.map((item, index) => {
                                    const documentName = convertCamelCase(
                                        item.documentName,
                                    );
                                    return (
                                        <CategoryContainer
                                            testId={`category-${index}`}
                                            key={index}
                                            index={index}
                                            label={documentName}
                                            onPress={() =>
                                                handleDocumentPress(item)
                                            }
                                        />
                                    );
                                })}
                            </View>
                        </View>
                    </View>
                    <Pressable
                        style={{
                            marginTop: 10,
                            marginBottom: 80,
                            borderBottomWidth: 0.6,
                            paddingBottom: 10,
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}
                        onPress={() => handleSnapPress(0)}>
                        <CustomText
                            fontFamily="semiBold"
                            fontSize="xl"
                            color="primaryColor">
                            {t('textShipSpecification')}
                        </CustomText>
                        <RightIcon />
                    </Pressable>
                </View>
            </ScreenLayout>
            <View
                style={{
                    position: 'absolute',
                    bottom: 30,
                    right: 30,
                }}>
                {shipData?.shipApproved ? (
                    <Button
                        testID="confirmation-unapprove-button"
                        title="Unapprove"
                        color="warning"
                        leftIcon={<CloseIcon />}
                        onSubmit={onPressUnapproval}
                    />
                ) : (
                    <Button
                        testID="confirmation-approval-button"
                        title="Approve"
                        color="secondary"
                        leftIcon={<CheckIcon />}
                        onSubmit={onPressApproval}
                    />
                )}
            </View>

            <DetailShipSheet
                onClose={handleClosePress}
                snapPoints={snapPoints}
                sheetRef={sheetRef}
                size={shipData?.size}
                specifications={shipData?.specifications}
            />

            <Modal
                testID="modal-unapprove"
                transparent={true}
                animationType="slide"
                visible={showUnapproveModal}
                onRequestClose={() => setShowUnapproveModal(false)}>
                <View
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                    <View
                        style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                        <View
                            style={{
                                backgroundColor: Color.softGreyBgPrimary,
                                borderRadius: 10,
                                width: '80%',
                                padding: 20,
                                shadowColor: '#000',
                                shadowOffset: {
                                    width: 0,
                                    height: 2,
                                },
                                shadowOpacity: 0.25,
                                shadowRadius: 3.84,
                                elevation: 5,
                                borderWidth: 3,
                                borderColor: Color.primaryColor,
                            }}>
                            <CustomText
                                fontFamily="semiBold"
                                fontSize="lg"
                                color="primaryColor">
                                Are you sure you want to Unapprove this ship?
                            </CustomText>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignItems: 'flex-start',
                                    padding: 10,
                                    borderColor: Color.infoColor,
                                }}>
                                <Button
                                    testID="unapprove-cancel-btn"
                                    title="Cancel"
                                    onSubmit={() =>
                                        setShowUnapproveModal(false)
                                    }
                                />
                                <Button
                                    testID="unapprove-button"
                                    title="Confirm"
                                    onSubmit={() => confirmUnapproval(true)}
                                />
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>

            <Modal
                testID="modalApproveConfirm"
                transparent={true}
                animationType="slide"
                visible={showConfirmationModal}
                onRequestClose={() => setShowConfirmationModal(false)}>
                <View
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                    <View
                        style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                        <View
                            style={{
                                backgroundColor: Color.softGreyBgPrimary,
                                borderRadius: 10,
                                width: '80%',
                                padding: 20,
                                shadowColor: '#000',
                                shadowOffset: {
                                    width: 0,
                                    height: 2,
                                },
                                shadowOpacity: 0.25,
                                shadowRadius: 3.84,
                                elevation: 5,
                                borderWidth: 3,
                                borderColor: Color.primaryColor,
                            }}>
                            <CustomText
                                fontFamily="semiBold"
                                fontSize="lg"
                                color="primaryColor">
                                Are you sure you want to approve this ship?
                            </CustomText>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignItems: 'flex-start',
                                    padding: 10,
                                    borderColor: Color.infoColor,
                                }}>
                                <Button
                                    testID="cancel-approve-btn"
                                    title="Cancel"
                                    onSubmit={() =>
                                        setShowConfirmationModal(false)
                                    }
                                />
                                <Button
                                    testID="approve-button"
                                    title="Confirm"
                                    onSubmit={() => confirmApproval(true)}
                                />
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>

            <ModalPdf
                visible={visiblePdf}
                onClose={handleShowModalPdf}
                selectedDocument={selectedDocument}
            />
        </>
    );
};

export default DetailShipAdmin;
