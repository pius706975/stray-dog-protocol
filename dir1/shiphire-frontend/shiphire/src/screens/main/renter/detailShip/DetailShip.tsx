import BottomSheet from '@gorhom/bottom-sheet';
import { useIsFocused } from '@react-navigation/native';
import moment from 'moment';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, useWindowDimensions } from 'react-native';
import { Badge, Image, View } from 'react-native-ui-lib';
import { useDispatch } from 'react-redux';
import {
    Button,
    CategoryContainer,
    CustomText,
    ScreenLayout,
} from '../../../../components';
import {
    AlarmIcon,
    AlarmIconFilled,
    Color,
    FCMTOKEN,
    RightIcon,
    SendIcon,
    USERDATA,
    getDataFromLocalStorage,
    setDataToLocalStorage,
} from '../../../../configs';
import { useGetRenterData, useGetShipById } from '../../../../hooks';
import { modalSlice, progressIndicatorSlice } from '../../../../slices';
import {
    AdditionalDocument,
    DetailShipsProps,
    GetRenterDataResponse,
    RenterUserData,
    ShipDatas,
} from '../../../../types';
import {
    DetailShipProfile,
    DetailShipSheet,
    ModalPdf,
    ReminderCountdown,
    ReminderModal,
} from './components';

const DetailShip: React.FC<DetailShipsProps> = ({ navigation, route }) => {
    const isFocused = useIsFocused();
    const mutationGetShipById = useGetShipById();
    const mutationGetRenterData = useGetRenterData();
    const { height } = useWindowDimensions();
    const { shipId } = route.params;
    const { t } = useTranslation('detailship');
    const [shipSaved, setShipSaved] = React.useState<boolean>(false);
    const [shipData, setShipData] = React.useState<ShipDatas>();
    const [token, setToken] = React.useState<string>('');
    const [isReminderModalVisible, setIsReminderModalVisible] =
        React.useState<boolean>(false);
    const [isReminderCountDownVisible, setIsReminderCountDownVisible] =
        React.useState<boolean>(false);
    const [shipAvailable, setShipAvailable] = React.useState<boolean>(true);
    const [remindSpotlight, setRemindSpotlight] =
        React.useState<boolean>(false);
    const [renterData, setRenterData] = React.useState<GetRenterDataResponse>();
    const formattedPrice = shipData?.pricePerMonth.toLocaleString('id-ID');
    const sheetRef = React.useRef<BottomSheet>(null);
    const snapPoints = React.useMemo(() => ['60%'], []);
    const [userData, setUserData] = React.useState<RenterUserData>({
        email: '',
        name: '',
        phoneNumber: '',
        imageUrl: '',
        isVerified: true,
        isPhoneVerified: true,
        isCompanySubmitted: true,
        isCompanyVerified: true,
        isCompanyRejected: false,
    });

    const dispatch = useDispatch();
    const { showModal, hideModal } = modalSlice.actions;
    const { showProgressIndicator, hideProgressIndicator } =
        progressIndicatorSlice.actions;

    const handleSnapPress = React.useCallback((index: number) => {
        sheetRef.current?.snapToIndex(index);
    }, []);
    const handleClosePress = React.useCallback(() => {
        sheetRef.current?.close();
    }, []);

    const shipReminder = renterData?.data.shipReminded.find(
        reminder => reminder.ship.id.name === shipData?.name,
    );

    const currentDate = moment();
    const expireDate = moment(shipReminder?.ship.reminderDate);
    const reminderCD = expireDate.diff(currentDate, 'seconds');
    const [visiblePdf, setVisiblePdf] = React.useState<boolean>(false);
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

    const onPressRequestQuote = () => {
        const shipHistory = shipData?.shipHistory || [];
        const currentDate = moment();
        const startRentDate = moment(
            shipData?.shipHistory[shipHistory.length - 1]?.rentStartDate || '',
        );

        if (shipHistory.length > 0) {
            const lastRentEndDate = moment(
                shipHistory[shipHistory.length - 1].rentEndDate,
            );

            // Check for deleteStatus being "approved"
            const isApproved = shipHistory.some(
                entry => entry.deleteStatus === 'approved',
            );

            if (isApproved) {
                // Ship delete status is approved; make it available
                navigateToRequestQuote();
            } else if (!shipAvailable) {
                showInfoModal(
                    'Sorry, this ship is not available right now, set a reminder to be notified when it is available again',
                );
                setRemindSpotlight(true);
            } else if (isUserReadyToRequestQuote()) {
                navigateToRequestQuote();
            }
        } else if (isUserReadyToRequestQuote()) {
            navigateToRequestQuote();
        }
    };

    const showInfoModal = (message: string) => {
        dispatch(
            showModal({
                status: 'info',
                text: message,
            }),
        );

        setTimeout(() => {
            dispatch(hideModal());
        }, 5000);
    };

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

    const isUserReadyToRequestQuote = () => {
        const {
            isVerified,
            isCompanySubmitted,
            phoneNumber,
            isCompanyVerified,
            isCompanyRejected,
        } = userData;

        if (!shipData?.rfqDynamicForm) {
            showInfoModal(
                "Sorry, this ship's Request for a quote has not been submitted by the ship owner yet, this form will be available soon",
            );
            return;
        }

        if (!isVerified) {
            dispatch(
                showModal({
                    status: 'info',
                    text: t('infoVerifyEmailFirst'),
                }),
            );
            setTimeout(() => {
                navigation.navigate('Account');
                dispatch(hideModal());
            }, 2000);
        } else if (!isCompanySubmitted) {
            dispatch(
                showModal({
                    status: 'info',
                    text: t('infoCompleteCompanyProfile'),
                }),
            );
            setTimeout(() => {
                navigation.navigate('Account');
                dispatch(hideModal());
            }, 2000);
        } else if (isCompanyRejected) {
            dispatch(
                showModal({
                    status: 'failed',
                    text: t('infoCompanyReject'),
                }),
            );
            setTimeout(() => {
                dispatch(hideModal());
            }, 2000);
        } else if (!isCompanyVerified) {
            dispatch(
                showModal({
                    status: 'info',
                    text: t('infoCompanyNotVerif'),
                }),
            );
            setTimeout(() => {
                dispatch(hideModal());
            }, 2000);
        } else if (!phoneNumber) {
            dispatch(
                showModal({
                    status: 'info',
                    text: t('infoAddPhoneFirst'),
                }),
            );
            setTimeout(() => {
                navigation.navigate('Account');
                dispatch(hideModal());
            }, 2000);
        }
        return (
            isVerified &&
            isCompanySubmitted &&
            phoneNumber &&
            !isCompanyRejected &&
            isCompanyVerified
        );
    };

    const navigateToRequestQuote = () => {
        navigation.navigate('RequestForAQuoteStack', {
            dynamicFormId: shipData?.rfqDynamicForm || '',
            shipId: shipData?._id || '',
            categoryId: shipData?.category?._id || '',
            shipOwnerId: shipData?.shipOwnerId?._id || '',
        });
    };

    const handleNavigateToShipAvailability = () => {
        navigation.navigate('ShipAvailability', {
            shipId: shipData?._id || '',
            shipHistory: shipData?.shipHistory,
        });
    };

    React.useEffect(() => {
        getDataFromLocalStorage(FCMTOKEN).then(resp => {
            setToken(resp);
        });
        dispatch(showProgressIndicator());
        getDataFromLocalStorage(USERDATA).then(resp => {
            setUserData(resp);
            console.log('user data', resp);
        });

        mutationGetShipById.mutate(shipId, {
            onSuccess: resp => {
                setShipData(resp.data.data);
                dispatch(hideProgressIndicator());
            },
        });

        mutationGetRenterData.mutate(undefined, {
            onSuccess: resp => {
                setRenterData(resp.data);
                setDataToLocalStorage(USERDATA, {
                    name: resp.data.data.userId.name,
                    email: resp.data.data.userId.email,
                    phoneNumber: resp.data.data.userId.phoneNumber,
                    imageUrl: resp.data.data.userId.imageUrl,
                    isVerified: resp.data.data.userId.isVerified,
                    isPhoneVerified: resp.data.data.userId.isPhoneVerified,
                    isCompanySubmitted:
                        resp.data.data.userId.isCompanySubmitted,
                    isCompanyVerified: resp.data.data.company.isVerified,
                    isCompanyRejected: resp.data.data.company.isRejected,
                });
            },
        });

        dispatch(showProgressIndicator());
    }, [isFocused]);

    React.useEffect(() => {
        const shipHistory = shipData?.shipHistory || [];
        const currentDate = moment();
        const today = moment(currentDate).format('DD MMM YYYY');

        if (shipHistory.length > 0) {
            shipHistory.forEach(item => {
                const startRentDate = moment(item.rentStartDate)
                    .utc()
                    .format('DD MMM YYYY');
                const lastRentEndDate = moment(item.rentEndDate).format(
                    'DD MMM YYYY',
                );

                const betweenDate = currentDate.isBetween(
                    item.rentStartDate,
                    item.rentEndDate,
                );
                if (
                    betweenDate ||
                    today === startRentDate ||
                    today === lastRentEndDate
                ) {
                    setShipAvailable(false);
                }
            });
        } else {
            setShipAvailable(true);
        }
    }, [shipData]);

    mutationGetShipById.isSuccess &&
        setTimeout(() => {
            dispatch(hideProgressIndicator());
        }, 2000);

    // console.log('renterData', JSON.stringify(renterData, null, 4));
    // console.log('shipId', JSON.stringify(shipId, null, 4));

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
                        {shipAvailable === false && (
                            <>
                                {!shipReminder && (
                                    <Pressable
                                        testID="iconReminderButtonBefore"
                                        style={{
                                            backgroundColor: Color.bgColor,
                                            padding: 6,
                                            borderRadius: 50,
                                            position: 'absolute',
                                            top: 12,
                                            right: 12,
                                        }}
                                        onPress={() =>
                                            setIsReminderModalVisible(
                                                !isReminderModalVisible,
                                            )
                                        }>
                                        <AlarmIcon />
                                        {remindSpotlight && (
                                            <View
                                                style={{
                                                    position: 'absolute',
                                                    right: -2,
                                                    top: -2,
                                                }}>
                                                <Badge
                                                    size={12}
                                                    backgroundColor={
                                                        Color.boldWarningColor
                                                    }
                                                />
                                            </View>
                                        )}
                                    </Pressable>
                                )}
                                {shipReminder && (
                                    <Pressable
                                        testID="iconReminderButtonAfter"
                                        style={{
                                            backgroundColor: Color.primaryColor,
                                            padding: 6,
                                            borderRadius: 50,
                                            position: 'absolute',
                                            top: 12,
                                            right: 12,
                                        }}
                                        onPress={() =>
                                            setIsReminderCountDownVisible(
                                                !isReminderCountDownVisible,
                                            )
                                        }>
                                        <AlarmIconFilled />
                                        {remindSpotlight && (
                                            <View
                                                style={{
                                                    position: 'absolute',
                                                    right: -2,
                                                    top: -2,
                                                }}>
                                                <Badge
                                                    size={12}
                                                    backgroundColor={
                                                        Color.boldWarningColor
                                                    }
                                                />
                                            </View>
                                        )}
                                    </Pressable>
                                )}
                            </>
                        )}
                    </View>
                ) : null}
                <View flex padding-10>
                    <View
                        style={{
                            paddingBottom: 10,
                        }}>
                        <DetailShipProfile
                            // shipDesc={shipData?.desc}
                            shipCategory={shipData?.category.name}
                            shipName={shipData?.name}
                            shipPrice={formattedPrice}
                            shipCity={shipData?.city}
                            shipProvince={shipData?.province}
                            shipRating={shipData?.rating}
                            shipSaved={shipSaved}
                            shipRented={shipData?.totalRentalCount}
                            handleShipSaved={() => setShipSaved(!shipSaved)}
                            // shipHistory={shipData?.shipHistory}
                        />
                    </View>
                    <View marginV-16>
                        <Button
                            testID="shipHistoryButton"
                            title={t('labelButtonShipHistory')}
                            onSubmit={() => {
                                handleNavigateToShipAvailability();
                            }}
                        />
                    </View>
                    <View
                        marginT-10
                        paddingT-20
                        paddingB-20
                        style={{
                            borderTopWidth: 0.6,
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
                        paddingB-20
                        style={{
                            borderBottomWidth: 0.6,
                        }}>
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
                            testID={`document-${shipData?.shipDocuments.length}`}
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
                                        testId={`categoryContainer-${index}`}
                                        index={index}
                                        key={index}
                                        label={documentName}
                                        onPress={() =>
                                            handleDocumentPress(item)
                                        }
                                    />
                                );
                            })}

                            {/* <CategoryContainer
                                label={t('labelVisitCompany2')}
                                onPress={() => console.log('pressed2')}
                            />
                            <CategoryContainer
                                label={t('labelVisitCompany3')}
                                onPress={() => console.log('pressed3')}
                            /> */}
                        </View>
                    </View>
                    <Pressable
                        testID="specificationButton"
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
                <Button
                    testID="requestQuoteButton"
                    title={t('labelButtonRFQ')}
                    color="success"
                    leftIcon={<SendIcon />}
                    onSubmit={() => onPressRequestQuote()}
                />
            </View>
            <DetailShipSheet
                testId="shipSheetClose"
                onClose={handleClosePress}
                snapPoints={snapPoints}
                sheetRef={sheetRef}
                size={shipData?.size}
                specifications={shipData?.specifications}
            />
            <ReminderModal
                token={token}
                shipId={shipData?._id || ''}
                navigation={navigation}
                visible={isReminderModalVisible}
                setVisible={setIsReminderModalVisible}
                lastRentEndDate={
                    new Date(
                        shipData &&
                        shipData.shipHistory &&
                        shipData.shipHistory.length > 0
                            ? shipData.shipHistory[
                                  shipData.shipHistory.length - 1
                              ].rentEndDate
                            : new Date(),
                    )
                }
            />
            <ReminderCountdown
                visible={isReminderCountDownVisible}
                setVisible={setIsReminderCountDownVisible}
                reminderCountdown={reminderCD}
            />
            <ModalPdf
                visible={visiblePdf}
                onClose={handleShowModalPdf}
                selectedDocument={selectedDocument}
            />
        </>
    );
};

export default DetailShip;
