import React from 'react';
import { useTranslation } from 'react-i18next';
import { Image, Text, View } from 'react-native-ui-lib';
import { Color, FontFamily, FontSize } from '../../../../../configs';
import { ShipInformationCardProps } from '../../../../../types';

const ShipInformationCard: React.FC<ShipInformationCardProps> = ({
    formattedShipSize,
    shipImageUrl,
    shipName,
    shipCategory,
}) => {
    const { t } = useTranslation('transactiondetail');
    return (
        <View
            style={{
                backgroundColor: Color.primaryColor,
                borderRadius: 6,
                padding: 16,
            }}>
            <View
                row
                spread
                style={{
                    borderBottomWidth: 0.5,
                    borderColor: Color.softGreyBgPrimary,
                    paddingBottom: 16,
                    alignItems: 'center',
                }}>
                <Text
                    style={{
                        fontSize: FontSize.lg,
                        fontFamily: FontFamily.medium,
                        color: Color.lightTextColor,
                    }}>
                    {t('ShipInformationCard.textShipInformation')}
                </Text>
                {/* <View
                    row
                    style={{
                        gap: 6,
                        alignItems: 'center',
                    }}>
                    <Text
                        style={{
                            fontSize: FontSize.xs,
                            fontFamily: FontFamily.regular,
                            color: Color.softSecColor,
                        }}>
                        {t('ShipInformationCard.textVisitCompany')}
                    </Text>
                    <Text
                        style={{
                            fontSize: FontSize.xs,
                            fontFamily: FontFamily.regular,
                            color: Color.softSecColor,
                        }}>
                        {'>'}
                    </Text>
                </View> */}
            </View>
            <View
                row
                style={{
                    alignItems: 'flex-start',
                    gap: 16,
                    paddingVertical: 10,
                    borderBottomWidth: 0.5,
                    borderColor: Color.softGreyBgPrimary,
                }}>
                <Image
                    source={{
                        uri: shipImageUrl
                            ? shipImageUrl
                            : 'https://picsum.photos/id/237/200/300',
                    }}
                    style={{
                        height: 80,
                        width: 100,
                    }}
                />
                <View flex>
                    <Text
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        style={{
                            fontSize: FontSize.lg,
                            fontFamily: FontFamily.medium,
                            color: Color.lightTextColor,
                        }}>
                        {shipName}
                    </Text>
                    <View
                        row
                        style={{
                            gap: 8,
                        }}>
                        <Text
                            style={{
                                fontSize: FontSize.sm,
                                fontFamily: FontFamily.regular,
                                color: Color.secColor,
                            }}>
                            {t('ShipInformationCard.textType')}
                        </Text>
                        <Text
                            style={{
                                fontSize: FontSize.sm,
                                fontFamily: FontFamily.regular,
                                color: Color.secColor,
                            }}>
                            {shipCategory}
                        </Text>
                    </View>
                    <View
                        row
                        style={{
                            gap: 8,
                        }}>
                        <Text
                            style={{
                                fontSize: FontSize.sm,
                                fontFamily: FontFamily.regular,
                                color: Color.secColor,
                            }}>
                            {t('ShipInformationCard.textSize')}
                        </Text>
                        <Text
                            style={{
                                fontSize: FontSize.sm,
                                fontFamily: FontFamily.regular,
                                color: Color.secColor,
                            }}>
                            {formattedShipSize}
                        </Text>
                    </View>
                </View>
            </View>
            <View></View>
        </View>
    );
};

export default ShipInformationCard;
