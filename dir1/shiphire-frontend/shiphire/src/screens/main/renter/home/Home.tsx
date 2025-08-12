import React from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Platform } from 'react-native';
import { useDispatch } from 'react-redux';
import { CustomSearchBar, ScreenLayout } from '../../../../components';
import { useGetPopularShips } from '../../../../hooks';
import { modalSlice } from '../../../../slices';
import { HomeProps, ShipDatas } from '../../../../types';
import {
    HeaderHome,
    ShipCategory,
    ShipListView,
    TopRateShipComponent,
} from './component';
import { useIsFocused } from '@react-navigation/native';

const Home: React.FC<HomeProps> = ({ navigation }) => {
    const dispatch = useDispatch();
    const { hideModal, showModal } = modalSlice.actions;
    const mutationGetPopularShips = useGetPopularShips();
    const plusPaddingV = Platform.OS === 'ios' ? 40 : 20;
    const isFocused = useIsFocused();
    const [popularShips, setPopularShips] = React.useState<ShipDatas[]>();

    const { t } = useTranslation('home');

    React.useEffect(() => {
        if (isFocused) {
            mutationGetPopularShips.mutate(undefined, {
                onSuccess: resp => {
                    const approvedShips = resp.data.data.filter(
                        ship => ship.shipApproved,
                    );
                    setPopularShips(approvedShips);
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
        }
    }, [isFocused]);

    return (
        <FlatList
            data={['']}
            keyExtractor={() => 'dummyKey'}
            renderItem={() => (
                <ScreenLayout
                    flex
                    start
                    testId="homeScreen"
                    backgroundColor="light"
                    padding={20}
                    marginB={40}
                    paddingV={plusPaddingV}>
                    <HeaderHome navigation={navigation} />
                    <CustomSearchBar
                        testId="searchBar"
                        placeholder={t('placeholderSearchBar')}
                        onPress={() => navigation.navigate('Search')}
                    />
                    {/* <ShipCategory navigation={navigation} /> */}
                    <TopRateShipComponent navigation={navigation} />
                    <ShipListView
                        testId="shipListViewPopular"
                        label={t('labelPopularShips')}
                        shipDatas={popularShips ? popularShips : []}
                        onLoading={mutationGetPopularShips.isLoading}
                        slice={4}
                        navigation={navigation}
                        onViewAllPressed={() => navigation.navigate('Search')}
                    />
                    <ShipListView
                        testId="shipListViewRecomendation"
                        label={t('labelRecomendation')}
                        shipDatas={popularShips ? popularShips : []}
                        onLoading={mutationGetPopularShips.isLoading}
                        navigation={navigation}
                        onViewAllPressed={() => navigation.navigate('Search')}
                    />
                </ScreenLayout>
            )}
        />
    );
};

export default Home;
