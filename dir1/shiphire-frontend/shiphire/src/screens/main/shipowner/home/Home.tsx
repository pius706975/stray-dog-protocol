import React from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, Pressable } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { Carousel, Text, View } from 'react-native-ui-lib';
import { useDispatch } from 'react-redux';
import {
    CarouselSkeleton,
    CategoryContainer,
    CustomText,
    ScreenLayout,
} from '../../../../components';
import {
    Color,
    FontFamily,
    FontSize,
    TransactionIcon,
    USERDATA,
    getDataFromLocalStorage,
} from '../../../../configs';
import {
    useGetShipCategories,
    useGetTopRatedOwner,
    useGetTopRentedOwner,
} from '../../../../hooks';
import { modalSlice } from '../../../../slices';
import {
    GetShipCategoriesOwnerResponse,
    ShipDatas,
    ShipOwnerHomeProps,
} from '../../../../types';
import { CarouselComponent, ShipListView } from './component';
import { useIsFocused } from '@react-navigation/native';

const Home: React.FC<ShipOwnerHomeProps> = ({ navigation }) => {
    const { t } = useTranslation('home');
    const dispatch = useDispatch();
    const { hideModal, showModal } = modalSlice.actions;
    const isFocused = useIsFocused();

    const [topRentedShips, setTopRentedShips] = React.useState<ShipDatas[]>();
    const [topRatedShips, setTopRatedShips] = React.useState<ShipDatas[]>();

    const mutationGetTopRatedShips = useGetTopRatedOwner();
    const mutationGetTopRentedShips = useGetTopRentedOwner();
    // const mutationGetShipCategories = useGetShipCategories();

    const [ownerName, setOwnerName] = React.useState<String>();

    const ownerNameSplit = ownerName?.split(' ')[0];
    const plusPaddingV = Platform.OS === 'ios' ? 40 : 20;

    // const [shipCategories, setShipCategories] =
    //     React.useState<GetShipCategoriesOwnerResponse>();

    const carouselData = topRatedShips?.map(item => ({
        imageUrl: item.imageUrl
            ? item.imageUrl
            : 'https://picsum.photos/id/237/200/300',
        _id: item._id,
        name: item.name,
        category: item.category.name,
        rating: item.rating,
    }));

    React.useEffect(() => {
        getDataFromLocalStorage(USERDATA).then(resp => {
            setOwnerName(resp?.name);
        });
    }, []);

    // React.useEffect(() => {
    //     mutationGetShipCategories.mutate(undefined, {
    //         onSuccess: resp => {
    //             setShipCategories(resp.data);
    //         },
    //         onError: err => {
    //             if (err.response?.status === 401) {
    //                 dispatch(
    //                     showModal({
    //                         status: 'failed',
    //                         text: t('failedTokenExpired'),
    //                     }),
    //                 );
    //                 setTimeout(() => {
    //                     dispatch(hideModal());
    //                 }, 4000);
    //             }
    //         },
    //     });
    // }, []);

    React.useEffect(() => {
        mutationGetTopRatedShips.mutate(undefined, {
            onSuccess: resp => {
                setTopRatedShips(resp.data.data);
            },
            onError: err => {
                if (err.response?.status === 401) {
                    dispatch(
                        showModal({
                            status: 'failed',
                            text: t('failedTokenExpired'),
                        }),
                    );
                    setTimeout(() => {
                        dispatch(hideModal());
                    }, 4000);
                }
            },
        });
    }, []);

    React.useEffect(() => {
        isFocused &&
            mutationGetTopRatedShips.mutate(undefined, {
                onSuccess: resp => {
                    setTopRatedShips(resp.data.data);
                },
                onError: err => {
                    if (err.response?.status === 401) {
                        dispatch(
                            showModal({
                                status: 'failed',
                                text: t('failedTokenExpired'),
                            }),
                        );
                        setTimeout(() => {
                            dispatch(hideModal());
                        }, 4000);
                    }
                },
            });
    }, [isFocused]);

    React.useEffect(() => {
        mutationGetTopRentedShips.mutate(undefined, {
            onSuccess: resp => {
                setTopRentedShips(resp.data.data);
            },
            onError: err => {
                if (err.response?.status === 401) {
                    dispatch(
                        showModal({
                            status: 'failed',
                            text: t('failedTokenExpired'),
                        }),
                    );
                    setTimeout(() => {
                        dispatch(hideModal());
                    }, 4000);
                }
            },
        });
    }, []);

    React.useEffect(() => {
        isFocused &&
            mutationGetTopRentedShips.mutate(undefined, {
                onSuccess: resp => {
                    setTopRentedShips(resp.data.data);
                },
                onError: err => {
                    if (err.response?.status === 401) {
                        dispatch(
                            showModal({
                                status: 'failed',
                                text: t('failedTokenExpired'),
                            }),
                        );
                        setTimeout(() => {
                            dispatch(hideModal());
                        }, 4000);
                    }
                },
            });
    }, [isFocused]);

    return (
        <FlatList
            testID="home-shipowner"
            data={['']}
            keyExtractor={() => 'dummyKey'}
            renderItem={() => (
                <ScreenLayout
                    flex
                    start
                    testId="homeScreenOwner"
                    backgroundColor="light"
                    padding={20}
                    marginB={40}
                    paddingV={plusPaddingV}>
                    <View row style={{ alignContent: 'space-between' }}>
                        <Text
                            style={{
                                fontFamily: FontFamily.bold,
                                fontSize: FontSize.xxl,
                                color: Color.primaryColor,
                                flex: 1,
                            }}>
                            {t('textGreet')} {ownerNameSplit}
                        </Text>
                        <Pressable
                            testID="transactionButton"
                            style={{
                                justifyContent: 'center',
                            }}
                            onPress={() =>
                                navigation.navigate('OwnerTransactionTabNav')
                            }>
                            <TransactionIcon />
                        </Pressable>
                    </View>

                    {/* <View
                        style={{
                            paddingTop: 10,
                            flexDirection: 'row',
                            paddingBottom: 10,
                        }}>
                        {shipCategories?.data.map(item => (
                            <CategoryContainer
                                key={item._id}
                                label={item.name}
                                onPress={() => console.log('Pressed')}
                            />
                        ))}
                    </View> */}

                    <View>
                        <Text
                            style={{
                                fontFamily: FontFamily.bold,
                                fontSize: FontSize.xxl,
                                color: Color.primaryColor,
                            }}>
                            {t('textTopRatedShips')}
                        </Text>

                        {mutationGetTopRatedShips.isLoading ? (
                            <CarouselSkeleton />
                        ) : topRatedShips && topRatedShips.length > 0 ? (
                            <Carousel
                                testID="carouselTopRatedShips"
                                autoplay
                                containerStyle={{
                                    height: 300,
                                    marginTop: 10,
                                    borderRadius: 10,
                                }}
                                pageControlProps={{
                                    size: 10,
                                    color: Color.secColor,
                                    inactiveColor: Color.bgNeutralColor,
                                }}
                                pageControlPosition={
                                    Carousel.pageControlPositions.OVER
                                }>
                                {carouselData?.map((item, i) => (
                                    <CarouselComponent
                                        testID={`carouselComponentTopRatedShips-${
                                            i + 1
                                        }`}
                                        categoryLabel={item.category}
                                        imageUrl={
                                            item.imageUrl
                                                ? item.imageUrl
                                                : 'https://picsum.photos/id/237/200/300'
                                        }
                                        key={i}
                                        onPress={() =>
                                            navigation.navigate(
                                                'OwnerDetailShip',
                                                {
                                                    shipId: item._id,
                                                },
                                            )
                                        }
                                        shipName={item.name}
                                        shipRating={item.rating}
                                    />
                                ))}
                            </Carousel>
                        ) : (
                            <View>
                                <CustomText
                                    fontFamily="regular"
                                    fontSize="md"
                                    color="darkTextColor"
                                    textAlign="center">
                                    {t('ShipOwner.textNoShipData')}
                                </CustomText>
                            </View>
                        )}
                        <View>
                            <ShipListView
                                testID="shipListViewTopRented"
                                label={t('textTopRentedShips')}
                                shipDatas={topRentedShips ? topRentedShips : []}
                                onLoading={mutationGetTopRentedShips.isLoading}
                                slice={10}
                                navigation={navigation}
                                onViewAllPressed={() =>
                                    navigation.navigate('Ships')
                                }
                            />
                        </View>
                    </View>
                </ScreenLayout>
            )}
        />
    );
};

export default Home;
