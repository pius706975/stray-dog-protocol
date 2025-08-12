import React from 'react';
import { View } from 'react-native-ui-lib';
import { ShipDatas, ShipManagementProps } from '../../../../types';
import { useGetAllShips } from '../../../../hooks';
import { useDispatch } from 'react-redux';
import { modalSlice } from '../../../../slices';
import { FlatList, Platform } from 'react-native';
import { ScreenLayout } from '../../../../components';
import { ShipCardAdminManage } from './components';
import { useIsFocused } from '@react-navigation/native';

const ShipManagement: React.FC<ShipManagementProps> = ({ navigation }) => {
    const dispatch = useDispatch();
    const { hideModal, showModal } = modalSlice.actions;
    const plusPaddingV = Platform.OS === 'ios' ? 40 : 20;
    const [ship, setShip] = React.useState<ShipDatas[]>([]);
    const isFocused = useIsFocused();
    const mutationGetAllShip = useGetAllShips();

    const renderItemShip = ({
        item,
        index,
    }: {
        item: ShipDatas;
        index: number;
    }) => {
        return (
            <ShipCardAdminManage
                index={index}
                status={item.shipApproved}
                shipName={item.name}
                shipCategory={item.category.name}
                shipImage={item.imageUrl}
                shipCompany={item.shipOwnerId.company.name}
                onPress={() =>
                    navigation.navigate('DetailShipAdmin', { shipId: item._id })
                }
            />
        );
    };

    React.useEffect(() => {
        mutationGetAllShip.mutate(undefined, {
            onSuccess: resp => {
                setShip(resp.data.data);
            },
            onError: err => {
                if (err.response?.status === 401) {
                    dispatch(
                        showModal({
                            status: 'failed',
                            text: 'failedTokenExpired',
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
            mutationGetAllShip.mutate(undefined, {
                onSuccess: resp => {
                    setShip(resp.data.data);
                },
            });
    }, [isFocused]);

    return (
        <FlatList
            data={['']}
            keyExtractor={() => 'dummyKey'}
            renderItem={() => (
                <ScreenLayout
                    flex
                    start
                    testId="AdminShipManagement"
                    backgroundColor="light"
                    padding={20}
                    marginB={40}
                    paddingV={plusPaddingV}>
                    <View>
                        <FlatList
                            testID="ship-management-flatlist"
                            ItemSeparatorComponent={() => <View marginV-8 />}
                            data={ship}
                            keyExtractor={item => item._id.toString()}
                            renderItem={renderItemShip}
                        />
                    </View>
                </ScreenLayout>
            )}
        />
    );
};

export default ShipManagement;
