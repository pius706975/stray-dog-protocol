import React from 'react';
import { Pressable } from 'react-native';
import { View } from 'react-native-ui-lib';
import {
    Button,
    CategoryContainer,
    CustomText,
    StarRating,
} from '../../../../../components';
import { Color, EditIcon } from '../../../../../configs';
import { OwnerDetailShipProfileProps } from '../../../../../types';
import { useTranslation } from 'react-i18next';
import { CustomCalendar } from '../../../../../components/CustomCalendar';

const DetailShipProfile: React.FC<OwnerDetailShipProfileProps> = ({
    handleEdit,
    shipDesc,
    shipName,
    shipRentedCount,
    shipPrice,
    shipCity,
    shipProvince,
    shipRating,
    shipCategory,
    shipHistory,
    // shipId,
    // shipImageUrl,
    // shipSize,
    // shipCompany,
    navigationToAddHistory,
    navigationToManageHistory,
}) => {
    const { t } = useTranslation('detailship');
    const [showCalendar, setShowCalendar] = React.useState<boolean>(false);

    const handleShowCalendar = () => {
        setShowCalendar(!showCalendar);
    };

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

                    <Pressable testID="edit-ship-button" onPressIn={handleEdit}>
                        <EditIcon color={Color.primaryColor} />
                    </Pressable>
                </View>
                <View>
                    <CustomText
                        fontFamily="regular"
                        fontSize="md"
                        color="darkTextColor">
                        {shipCategory}
                    </CustomText>
                </View>
                <View row spread centerV marginV-5>
                    <CustomText
                        fontFamily="regular"
                        fontSize="md"
                        color="darkTextColor">
                        {shipCity}
                    </CustomText>
                    <CustomText
                        fontFamily="regular"
                        fontSize="md"
                        color="darkTextColor">
                        {shipProvince}
                    </CustomText>
                </View>
                <View row spread centerV marginV-5>
                    <View row centerV style={{ gap: 10 }}>
                        <StarRating rating={shipRating ? shipRating : 0} />
                        {/* <CustomText
                            fontFamily="regular"
                            fontSize="sm"
                            color="darkTextColor">
                            {shipRating} | 0{' '}
                            {t('DetailShipProfile.textReviews')}
                        </CustomText> */}
                    </View>
                    <CustomText
                        fontFamily="regular"
                        fontSize="sm"
                        color="darkTextColor">
                        {shipRentedCount} {t('DetailShipProfile.textRented')}
                    </CustomText>
                </View>
                <View marginV-16>
                    <Button
                        testID="custom-calendar-button"
                        title={t('labelButtonShipHistory')}
                        onSubmit={() => {
                            handleShowCalendar();
                        }}
                    />
                    <CustomCalendar
                        testID="custom-calendar"
                        visible={showCalendar}
                        onClose={handleShowCalendar}
                        shipHistory={shipHistory}
                        navigateToAddHistory={() => navigationToAddHistory()}
                        navigateToManageHistory={() =>
                            navigationToManageHistory()
                        }
                    />
                </View>
            </View>
            {/* <View
                row
                paddingV-10
                style={{
                    rowGap: 10,
                    flexWrap: 'wrap',
                    borderBottomWidth: 0.6,
                }}>
                <CategoryContainer
                    label={shipCategory!!}
                    onPress={() => console.log('pressed')}
                />
                <CategoryContainer
                    label={t('DetailShipProfile.labelSize')}
                    onPress={() => console.log('pressed')}
                />
                <CategoryContainer
                    label={t('DetailShipProfile.labelPayload')}
                    onPress={() => console.log('pressed')}
                />
            </View> */}
            <View
                marginT-10
                paddingB-20
                style={{
                    borderBottomWidth: 0.6,
                }}>
                <CustomText
                    fontFamily="semiBold"
                    fontSize="xl"
                    color="primaryColor">
                    {t('DetailShipProfile.textDescription')}
                </CustomText>
                <CustomText
                    fontFamily="regular"
                    fontSize="md"
                    color="darkTextColor"
                    lineHeight={22}>
                    {shipDesc}
                </CustomText>
            </View>
        </>
    );
};

export default DetailShipProfile;
