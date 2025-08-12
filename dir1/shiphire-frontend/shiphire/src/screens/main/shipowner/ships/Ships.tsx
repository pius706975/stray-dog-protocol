import React from 'react';
import { FlatList, Platform, Pressable } from 'react-native';
import { View } from 'react-native-ui-lib';
import {
    CustomSearchBar,
    CustomText,
    ScreenLayout,
} from '../../../../components';
import { PlusIcon, getDataFromLocalStorage } from '../../../../configs';
import {
    GetShipOwnerDataResponse,
    OwnerShipsProps,
    ShipDatas,
} from '../../../../types';
import { ShipListView } from './components';
import { useGetOwnerShips, useGetShipOwnerData } from '../../../../hooks';
import { useTranslation } from 'react-i18next';
import { useIsFocused } from '@react-navigation/native';
import { modalSlice } from '../../../../slices';
import { useDispatch } from 'react-redux';

const Ships: React.FC<OwnerShipsProps> = ({ navigation }) => {
    const MutationGetOwnerShips = useGetOwnerShips();
    const mutationShipOwnerCompany = useGetShipOwnerData();
    const [ownerShips, setOwnerShips] = React.useState<ShipDatas[]>([]);
    const [shipOwnerData, setShipOwnerData] =
        React.useState<GetShipOwnerDataResponse>();
    const { hideModal, showModal } = modalSlice.actions;
    const dispatch = useDispatch();
    const plusPaddingV = Platform.OS === 'ios' ? 40 : 20;
    const { t } = useTranslation('ships');
    const isFocused = useIsFocused();

    React.useEffect(() => {
        if (isFocused) {
            MutationGetOwnerShips.mutate(undefined, {
                onSuccess: resp => {
                    setOwnerShips(resp.data.data);
                },
            });
            mutationShipOwnerCompany.mutate(undefined, {
                onSuccess: resp => {
                    setShipOwnerData(resp.data);
                },
                onError: err => {
                    if (err.response?.status === 401) {
                        dispatch(
                            showModal({
                                status: 'failed',
                                text: 'Token expired, please re-sign in',
                            }),
                        );
                        setTimeout(() => {
                            dispatch(hideModal());
                        }, 4000);
                    }
                },
            });
        }
    }, [isFocused]);

    React.useEffect(() => {
        isFocused &&
            MutationGetOwnerShips.mutate(undefined, {
                onSuccess: resp => {
                    setOwnerShips(resp.data.data);
                },
            });
    }, [isFocused]);

    const handleAddShip = () => {
        console.log('shipOwnerData', shipOwnerData?.data.company.isRejected);
        if (shipOwnerData?.data.company.isRejected) {
            dispatch(
                showModal({
                    status: 'failed',
                    text: t('infoCompanyReject'),
                }),
            );
            setTimeout(() => {
                dispatch(hideModal());
            }, 4000);
        } else if (!shipOwnerData?.data.company.isVerified) {
            dispatch(
                showModal({
                    status: 'info',
                    text: t('infoCompanyNotVerif'),
                }),
            );
            setTimeout(() => {
                dispatch(hideModal());
            }, 4000);
        } else {
            navigation.navigate('GeneralForm');
        }
    };
    return (
        <FlatList
            data={['']}
            keyExtractor={() => 'dummyKey'}
            renderItem={() => (
                <ScreenLayout
                    testId="shipsScreen"
                    backgroundColor="light"
                    paddingV={plusPaddingV}>
                    <View
                        marginH-16
                        marginT-8
                        row
                        style={{
                            alignContent: 'center',
                            justifyContent: 'space-between',
                        }}>
                        {/* <View style={{ flex: 1 }}>
                            <CustomSearchBar
                                testId="searchBar"
                                placeholder={t('placeholderSearch')}
                                onPress={() => {}}
                            />
                        </View> */}
                        <CustomText
                            fontSize="xxl"
                            fontFamily="bold"
                            color="primaryColor">
                            {t('placeholderSearch')}
                        </CustomText>
                        <Pressable
                            testID="addShipButton"
                            style={{
                                justifyContent: 'center',
                                paddingLeft: 12,
                            }}
                            onPress={() => handleAddShip()}>
                            <PlusIcon />
                        </Pressable>
                    </View>
                    <View marginH-16 marginB-80>
                        <ShipListView
                            testID="shipListView"
                            shipDatas={ownerShips ? ownerShips : []}
                            onLoading={MutationGetOwnerShips.isLoading}
                            // slice={50}
                            navigation={navigation}
                        />
                    </View>
                </ScreenLayout>
            )}
        />
    );
};
export default Ships;
