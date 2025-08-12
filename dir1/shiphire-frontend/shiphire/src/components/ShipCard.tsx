import React from 'react';
import { Image, View, useWindowDimensions } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Text } from 'react-native-ui-lib';
import { Color, FontFamily, FontSize } from '../configs';
import { ShipCardProps } from '../types';
import { useTranslation } from 'react-i18next';

const ShipCard: React.FC<ShipCardProps> = ({
    category,
    imageUrl,
    onPress,
    name,
    pricePerMonth,
    city,
    totalRental,
    testId,
}) => {
    const { width, height } = useWindowDimensions();
    const { t } = useTranslation('home');
    const formattedPrice = pricePerMonth.toLocaleString('id-ID');
    return (
        <TouchableOpacity onPress={onPress}>
            <View
                style={[
                    stylesShip.container,
                    { width: width / 2 - 26, height: height / 3 },
                ]}>
                <Image
                    source={{
                        uri: imageUrl
                            ? imageUrl
                            : 'https://picsum.photos/id/237/200/300',
                    }}
                    style={stylesShip.gambar}
                />
                <View
                    style={{
                        padding: 8,
                        flex: 1,
                        justifyContent: 'space-evenly',
                    }}>
                    <Text
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        style={stylesShip.itemText}>
                        {name}{' '}
                    </Text>
                    <Text style={stylesShip.itemCat}>{category}</Text>
                    <Text style={stylesShip.itemPrice}>
                        ±Rp {formattedPrice}
                    </Text>
                    <Text style={stylesShip.itemCity}>{city}</Text>
                    <View
                        style={{
                            alignItems: 'flex-end',
                        }}>
                        <Text style={stylesShip.hiredCount}>
                            {totalRental} {t('textRented')}
                        </Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const stylesShip = {
    container: {
        backgroundColor: Color.softSecBgPrimary,
        borderRadius: 5,
        borderWidth: 2,
        borderColor: Color.softPrimaryColor,
    },
    itemText: {
        fontFamily: FontFamily.bold,
        fontSize: FontSize.lg,
    },
    itemCat: {
        fontFamily: FontFamily.regular,
        fontSize: FontSize.sm,
        color: Color.darkTextColor,
    },
    itemPrice: {
        fontFamily: FontFamily.bold,
        fontSize: FontSize.sm,
        color: Color.primaryColor,
    },
    hiredCount: {
        fontFamily: FontFamily.regular,
        fontSize: FontSize.sm,
        color: Color.darkTextColor,
    },
    itemCity: {
        fontFamily: FontFamily.regular,
        fontSize: FontSize.sm,
        color: Color.primaryColor,
    },
    gambar: {
        height: '50%',
        width: '100%',
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
    },
};

export default ShipCard;
