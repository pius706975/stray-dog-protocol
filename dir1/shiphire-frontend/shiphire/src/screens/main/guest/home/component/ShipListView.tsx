import React from 'react';
import { FlatList, ListRenderItemInfo, Pressable } from 'react-native';
import { View } from 'react-native-ui-lib';
import {
    CustomText,
    ShipCard,
    ShipCardSkeleton,
} from '../../../../../components';
import { ShipDatas, GuestShipListViewProps } from '../../../../../types';
import { useTranslation } from 'react-i18next';

const ShipListView: React.FC<GuestShipListViewProps> = ({
    label,
    navigation,
    onViewAllPressed,
    onLoading,
    shipDatas,
    slice,
    testId,
}) => {
    const formattedShipData = slice ? shipDatas.slice(0, slice) : shipDatas;
    const { t } = useTranslation('home');
    const dummyShip: { _id: string }[] = [
        { _id: '1' },
        { _id: '2' },
        { _id: '3' },
        { _id: '4' },
    ];

    const renderItemPopularShip = ({ item }: ListRenderItemInfo<ShipDatas>) => {
        return (
            <ShipCard
                name={item.name}
                category={item.category.name}
                imageUrl={
                    item.imageUrl
                        ? item.imageUrl
                        : 'https://picsum.photos/id/237/200/300'
                }
                pricePerMonth={item.pricePerMonth}
                city={item.city}
                totalRental={item.totalRentalCount}
                onPress={() =>
                    navigation.navigate('SignIn')
                }
            />
        );
    };

    return (
        <>
            <View testID={`${testId}-ships`}>
                <View row spread centerV paddingV-10>
                    <CustomText
                        fontSize="xxl"
                        fontFamily="bold"
                        color="primaryColor">
                        {label}
                    </CustomText>
                    <Pressable
                        onPress={onViewAllPressed}
                        testID={`${testId}-button`}>
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
                        testID={`shipListViewPopular-${testId}`}
                        data={formattedShipData}
                        keyExtractor={item => item._id}
                        renderItem={renderItemPopularShip}
                        numColumns={2}
                        contentContainerStyle={{
                            gap: 14,
                        }}
                        columnWrapperStyle={{
                            justifyContent: 'space-between',
                            marginTop: 14,
                        }}
                    />
                )}
            </View>
        </>
    );
};

export default ShipListView;
