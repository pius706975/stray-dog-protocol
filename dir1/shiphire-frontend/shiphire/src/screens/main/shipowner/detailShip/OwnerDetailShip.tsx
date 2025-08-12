import BottomSheet from '@gorhom/bottom-sheet';
import React from 'react';
import {
    Alert,
    Image,
    Pressable,
    useWindowDimensions,
    FlatList,
} from 'react-native';
import { View } from 'react-native-ui-lib';
import {
    Button,
    CategoryContainer,
    CustomText,
    ScreenLayout,
} from '../../../../components';
import {
    ArrowBackIcon,
    Color,
    EditIcon,
    RightIcon,
    TrashIcon,
} from '../../../../configs';
import { useDeleteShip, useGetShipById } from '../../../../hooks';
import {
    DynamicFormRFQ,
    OwnerDetailShipProps,
    ShipDatas,
    SpecificFormAddShipRequest,
} from '../../../../types';

import { useIsFocused } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import {
    addShipSlice,
    modalSlice,
    progressIndicatorSlice,
} from '../../../../slices';
import { GeneralFormAddShipRequest } from '../../../../types';
import {
    ConfirmationModal,
    DetailShipProfile,
    DetailShipSheet,
    EditDocumentMenu,
} from './components';
import { Platform } from 'react-native';

const OwnerDetailShip: React.FC<OwnerDetailShipProps> = ({
    navigation,
    route,
}) => {
    const { t } = useTranslation('detailship');
    const isFocus = useIsFocused();
    const mutationGetShipById = useGetShipById();
    const { height } = useWindowDimensions();
    const { shipId } = route.params;
    const [shipData, setShipData] = React.useState<ShipDatas>({
        _id: '',
        size: {
            length: 0,
            width: 0,
            height: 0,
        },
        shipOwnerId: {
            _id: '',
            company: {
                name: '',
                companyType: '',
                address: '',
                isVerified: false,
                isRejected: false,
            },
        },
        name: '',
        desc: '',
        tags: [],
        pricePerMonth: 0,
        city: '',
        province: '',
        category: {
            _id: '',
            name: '',
        },
        facilities: [
            {
                _id: '',
                name: '',
                type: '',
            },
        ],
        specifications: [
            {
                _id: '',
                name: '',
                spesificationId: { units: '' },
                value: '',
            },
        ],
        rating: 0,
        totalRentalCount: 0,
        shipDocuments: [],
        __v: 0,
        imageUrl: '',
        shipHistory: [
            {
                _id: '',
                rentStartDate: '',
                rentEndDate: '',
                locationDeparture: '',
                locationDestination: '',
                needs: '',
                renterCompanyName: '',
                deleteStatus: '',
                price: '',
                genericDocument: [
                    {
                        fileName: '',
                        fileUrl: '',
                    },
                ],
            },
        ],
        rfqDynamicForm: '',
        shipApproved: [
            {
                name: '',
                desc: '',
                approvedShip: false,
                _id: '',
            },
        ],
    });
    const formattedPrice = shipData.pricePerMonth.toLocaleString('id-ID');
    const sheetRef = React.useRef<BottomSheet>(null);
    const snapPoints = React.useMemo(() => ['60%'], []);
    React.useState<boolean>(false);
    const { showModal, hideModal } = modalSlice.actions;
    const { showProgressIndicator, hideProgressIndicator } =
        progressIndicatorSlice.actions;
    const { addGeneralData, addSpesificData } = addShipSlice.actions;
    const dispatch = useDispatch();
    const mutationDeleteShip = useDeleteShip();
    const plusMarginTop = Platform.OS === 'ios' ? 16 : 0;
    const [isConfirmationModalVisible, setConfirmationModalVisible] =
        React.useState(false);

    const handleSnapPress = React.useCallback((index: number) => {
        sheetRef.current?.snapToIndex(index);
    }, []);
    const handleClosePress = React.useCallback(() => {
        sheetRef.current?.close();
    }, []);

    const handleEdit = () => {
        const generalData: GeneralFormAddShipRequest = {
            shipName: shipData!!.name,
            shipDescription: shipData!!.desc,
            shipCategory: shipData!!.category.name,
            shipLocation: `${shipData!!.city} - ${shipData!!.province}`,
            rentPrice: shipData!!.pricePerMonth,
        };
        const specifiData: SpecificFormAddShipRequest = {
            length: shipData!!.size.length.toString(),
            width: shipData!!.size.width.toString(),
            height: shipData!!.size.height.toString(),
            specifications: shipData!!.specifications,
            facilities: shipData!!.facilities.map(facility => facility.name),
        };
        dispatch(addGeneralData(generalData));
        dispatch(addSpesificData(specifiData));
        navigation.navigate('EditGeneralForm', {
            shipId: shipId,
        });
    };

    const handleDelete = () => {
        mutationDeleteShip.mutate(shipId, {
            onSuccess: resp => {
                dispatch(
                    showModal({
                        status: 'info',
                        text: t('ShipOwner.infoDeletedSuccess'),
                    }),
                );
                setTimeout(() => {
                    dispatch(hideModal());
                }, 2000);
                navigation.navigate('ShipOwnerHome');
            },
            onError: err => {
                dispatch(
                    showModal({
                        status: 'failed',
                        text: t('ShipOwner.failedDeleteShip'),
                    }),
                );
                setTimeout(() => {
                    dispatch(hideModal());
                }, 2000);
            },
        });
    };

    const handleEditImage = () => {
        navigation.navigate('EditImageForm', {
            shipId: shipId,
            shipName: shipData.name,
        });
    };

    const showConfirmationModal = () => {
        setConfirmationModalVisible(true);
    };

    const hideConfirmationModal = () => {
        setConfirmationModalVisible(false);
    };

    const confirmSubmit = () => {
        hideConfirmationModal();
        handleDelete();
    };

    const onPressAddHistory = () => {
        navigation.navigate('AddTransactionHistory', {
            shipId: shipId,
            shipName: shipData.name,
            shipCategory: shipData.category.name,
            shipImageUrl: shipData.imageUrl,
            shipSize: {
                length: shipData.size.length,
                width: shipData.size.width,
                height: shipData.size.height,
            },
            shipCompany: {
                name: shipData.shipOwnerId.company.name,
                companyType: shipData.shipOwnerId.company.companyType,
            },
        });
    };

    const onPressManageHistory = () => {
        navigation.navigate('ManageTransactionHistory', {
            shipId: shipData?._id || '',
            shipHistory: shipData?.shipHistory,
        });
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

    React.useEffect(() => {
        mutationGetShipById.mutate(shipId, {
            onSuccess: resp => {
                setShipData(resp.data.data);
            },
        });
    }, [isFocus]);

    React.useEffect(() => {
        shipData == undefined
            ? dispatch(showProgressIndicator())
            : dispatch(hideProgressIndicator());
    }, [shipData]);

    return (
        <>
            <View
                testID="detail-ship-header"
                style={{
                    backgroundColor: Color.bgColor,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    elevation: 12,
                    paddingTop: 20,
                    marginTop: plusMarginTop,
                }}>
                <Pressable
                    onPress={() =>
                        navigation.reset({
                            index: 0,
                            routes: [{ name: 'ShipOwnerHome' }],
                        })
                    }
                    style={{ margin: 16 }}>
                    <ArrowBackIcon color={Color.primaryColor} />
                </Pressable>
                <View style={{ marginTop: 10 }}>
                    <CustomText
                        fontFamily="semiBold"
                        fontSize="xl"
                        color="primaryColor">
                        {t('textDetailShip')}
                    </CustomText>
                </View>
                <Pressable
                    testID="delete-ship-button"
                    onPress={showConfirmationModal}
                    style={{ margin: 12 }}>
                    <TrashIcon />
                </Pressable>
            </View>
            <ScreenLayout testId="DetailShipScreen" backgroundColor="light">
                {shipData.imageUrl ? (
                    <View>
                        <Image
                            source={{
                                uri: shipData.imageUrl,
                            }}
                            style={{
                                height: height / 3,
                                width: '100%',
                            }}
                        />
                        <Pressable
                            testID="edit-image-button"
                            style={{
                                backgroundColor: Color.bgColor,
                                padding: 4,
                                borderRadius: 50,
                                opacity: 0.8,
                                position: 'absolute',
                                top: 10,
                                right: 10,
                            }}
                            onPress={() => {
                                handleEditImage();
                            }}>
                            <EditIcon color={Color.primaryColor} />
                        </Pressable>
                    </View>
                ) : null}
                <View flex padding-10>
                    <View
                        style={{
                            paddingBottom: 10,
                        }}>
                        <DetailShipProfile
                            shipDesc={shipData.desc}
                            shipName={shipData.name}
                            shipRentedCount={shipData.totalRentalCount}
                            shipPrice={formattedPrice}
                            shipCity={shipData.city}
                            shipProvince={shipData.province}
                            shipRating={shipData.rating}
                            shipCategory={shipData.category.name}
                            handleEdit={handleEdit}
                            shipHistory={shipData.shipHistory}
                            navigationToAddHistory={onPressAddHistory}
                            navigationToManageHistory={onPressManageHistory}
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
                            {t('ShipOwner.textShipFacility')}
                        </CustomText>
                        <View
                            row
                            marginT-10
                            style={{
                                rowGap: 10,
                                flexWrap: 'wrap',
                            }}>
                            {shipData.facilities.map((facility, index) => {
                                return (
                                    <CategoryContainer
                                        key={index}
                                        label={facility.name}
                                        onPress={() => console.log('pressed')}
                                    />
                                );
                            })}
                        </View>
                    </View>
                    <Pressable
                        testID="bottom-sheet-button"
                        style={{
                            marginTop: 10,
                            marginBottom: 20,
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
                            {t('DetailShipSheet.textShipSpecification')}
                        </CustomText>
                        <RightIcon />
                    </Pressable>
                    {/* <SafeAreaView style={{ flex: 1 }}> */}
                    <FlatList
                        data={shipData.shipDocuments}
                        showsHorizontalScrollIndicator={false}
                        renderItem={({ item, index }) => {
                            const documentName = convertCamelCase(
                                item.documentName,
                            );
                            return (
                                <EditDocumentMenu
                                    key={index}
                                    navigation={navigation}
                                    pdfUrl={item.documentUrl}
                                    label={documentName}
                                    documentExpired={item?.documentExpired}
                                    shipId={shipId}
                                    documentName={item.documentName}
                                />
                            );
                        }}
                        keyExtractor={item => item._id}
                        scrollEnabled={false}
                    />
                </View>
                <ConfirmationModal
                    testID="delete-ship-modal"
                    isVisible={isConfirmationModalVisible}
                    onConfirm={confirmSubmit}
                    onCancel={hideConfirmationModal}
                />
            </ScreenLayout>
            <View
                style={{
                    position: 'absolute',
                    bottom: 30,
                    right: 30,
                }}>
                {shipData.rfqDynamicForm && (
                    <Button
                        testID="view-rfq-button"
                        title={t('ShipOwner.textButtonViewRFQ')}
                        color="success"
                        // leftIcon={<PlusIcon />}
                        onSubmit={() =>
                            navigation.navigate('RFQFormInputView', {
                                _id: shipData.rfqDynamicForm,
                                category: shipData.category.name,
                                shipId: shipId,
                            })
                        }
                    />
                )}
            </View>
            {shipData.size ? (
                <DetailShipSheet
                    testId="detail-ship-sheet"
                    onClose={handleClosePress}
                    snapPoints={snapPoints}
                    sheetRef={sheetRef}
                    size={shipData!!.size}
                    specifications={shipData!!.specifications}
                />
            ) : null}
        </>
    );
};

export default OwnerDetailShip;
