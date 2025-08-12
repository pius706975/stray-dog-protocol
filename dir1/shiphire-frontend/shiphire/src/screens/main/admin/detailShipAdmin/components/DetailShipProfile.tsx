import React from 'react';
import { View } from 'react-native-ui-lib';
import {
    Button,
    CategoryContainer,
    CustomText,
    StarRating,
} from '../../../../../components';
import {
    DetailShipProfileAdminProps,
    DetailShipProfileProps,
} from '../../../../../types';
import { useTranslation } from 'react-i18next';
import { CustomCalendar } from '../../../../../components/CustomCalendar';

const DetailShipProfile: React.FC<DetailShipProfileAdminProps> = ({
    shipSaved,
    shipName,
    shipPrice,
    shipRating,
    shipCategory,
    shipRented,
}) => {
    const { t } = useTranslation('detailship');

    return (
        <>
            <View
                style={{
                    borderBottomWidth: 0.6,
                    paddingBottom: 10,
                }}>
                <View row spread centerV>
                    <View
                        style={{
                            gap: -5,
                        }}>
                        <CustomText
                            fontFamily="semiBold"
                            fontSize="xl1"
                            color="primaryColor"
                            numberOfLines={1}
                            ellipsizeMode>
                            {shipName}
                        </CustomText>
                        <CustomText
                            fontFamily="medium"
                            fontSize="xl"
                            color="primaryColor">
                            ±Rp {shipPrice} {t('DetailShipProfile.textMonth')}
                        </CustomText>
                    </View>
                </View>
                <View row spread centerV marginV-5>
                    <View row centerV style={{ gap: 10 }}>
                        <StarRating rating={shipRating ? shipRating : 0} />
                        {/* <CustomText
                            fontFamily="regular"
                            fontSize="sm"
                            color="darkTextColor">
                            {shipRating} | 20{' '}
                            {t('DetailShipProfile.textReviews')}
                        </CustomText> */}
                    </View>
                    <CustomText
                        fontFamily="regular"
                        fontSize="sm"
                        color="darkTextColor">
                        {shipRented} {t('DetailShipProfile.textRented')}
                    </CustomText>
                </View>
            </View>
            <View
                row
                paddingV-10
                style={{
                    rowGap: 10,
                    flexWrap: 'wrap',
                    borderBottomWidth: 0.6,
                }}>
                <View
                    style={{
                        justifyContent: 'center',
                    }}>
                    <CustomText
                        fontFamily="semiBold"
                        fontSize="lg"
                        color="primaryColor">
                        Kategori :
                    </CustomText>
                </View>
                <CategoryContainer
                    label={t('DetailShipProfile.labelCategory')}
                    onPress={() => console.log('pressed')}
                />
            </View>
        </>
    );
};

export default DetailShipProfile;
