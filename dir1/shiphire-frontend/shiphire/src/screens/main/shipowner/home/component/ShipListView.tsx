import React from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, ListRenderItemInfo, Pressable } from 'react-native';
import { View } from 'react-native-ui-lib';
import {
    CustomText,
    ShipCard,
    ShipCardSkeleton,
} from '../../../../../components';
import { ShipDatas, ShipListViewOwnerProps } from '../../../../../types';

const ShipListView: React.FC<ShipListViewOwnerProps> = ({
    label,
    navigation,
    onViewAllPressed,
    onLoading,
    shipDatas,
    slice,
    testID,
}) => {
    const formattedShipData = slice ? shipDatas.slice(0, slice) : shipDatas;
    const { t } = useTranslation('home');

    const dummyShip: { _id: string }[] = [
        { _id: '1' },
        { _id: '2' },
        { _id: '3' },
        { _id: '4' },
    ];

    const renderItemTopRentedShip = ({
        item,
    }: ListRenderItemInfo<ShipDatas>) => {
        return (
            <ShipCard
                name={item.name}
                category={item.category.name}
                imageUrl={item.imageUrl}
                pricePerMonth={item.pricePerMonth}
                city={item.city}
                totalRental={item.totalRentalCount}
                onPress={() =>
                    navigation.navigate('OwnerDetailShip', { shipId: item._id })
                }
            />
        );
    };

    const renderEmptyContainer = () => {
        return (
            <View center marginT-20>
                <CustomText
                    color="darkTextColor"
                    fontSize="md"
                    fontFamily="regular">
                    {t('ShipOwner.textNoShipData')}
                </CustomText>
            </View>
        );
    };

    return (
        <>
            <View row spread centerV paddingV-10>
                <CustomText
                    fontSize="xxl"
                    fontFamily="bold"
                    color="primaryColor">
                    {label}
                </CustomText>
                <Pressable testID="viewAllButton" onPress={onViewAllPressed}>
                    <CustomText
                        fontSize="sm"
                        fontFamily="regular"
                        color="darkTextColor">
                        {t('textViewAll')} {'>'}
                    </CustomText>
                </Pressable>
            </View>
            {onLoading ? (
                <FlatList
                    data={dummyShip}
                    keyExtractor={item => item._id}
                    renderItem={() => <ShipCardSkeleton />}
                    numColumns={2}
                    contentContainerStyle={{
                        gap: 14,
                    }}
                    columnWrapperStyle={{
                        justifyContent: 'space-between',
                        marginTop: 14,
                    }}
                />
            ) : (
                <FlatList
                    testID={testID}
                    data={formattedShipData}
                    keyExtractor={item => item._id}
                    renderItem={renderItemTopRentedShip}
                    numColumns={2}
                    contentContainerStyle={{
                        gap: 14,
                    }}
                    columnWrapperStyle={{
                        justifyContent: 'space-between',
                        marginTop: 14,
                    }}
                    ListEmptyComponent={renderEmptyContainer}
                />
            )}
        </>
    );
};

export default ShipListView;
