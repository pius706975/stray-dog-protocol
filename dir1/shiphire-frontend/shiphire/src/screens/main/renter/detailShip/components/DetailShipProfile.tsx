import React from 'react';
import { View } from 'react-native-ui-lib';
import {
    Button,
    CategoryContainer,
    CustomText,
    StarRating,
} from '../../../../../components';
import { Pressable } from 'react-native';
import { SaveOffIcon, SaveOnIcon } from '../../../../../configs';
import { DetailShipProfileProps } from '../../../../../types';
import { useTranslation } from 'react-i18next';
import { CustomCalendar } from '../../../../../components/CustomCalendar';

const DetailShipProfile: React.FC<DetailShipProfileProps> = ({
    handleShipSaved,
    shipSaved,
    shipCategory,
    shipRented,
    // shipDesc,
    shipName,
    shipPrice,
    shipCity,
    shipProvince,
    shipRating,
    // shipHistory,
}) => {
    const { t } = useTranslation('detailship');
    const [showCalendar, setShowCalendar] = React.useState<boolean>(false);

    const handleShowCalendar = () => {
        console.log('pressed');
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
                    {/* <Pressable onPressIn={handleShipSaved}>
                        {shipSaved ? <SaveOnIcon /> : <SaveOffIcon />}
                    </Pressable> */}
                </View>
                <View>
                    <CustomText
                        fontFamily="regular"
                        fontSize="sm"
                        color="darkTextColor">
                        {shipCategory}
                    </CustomText>
                </View>
                <View row spread centerV marginV-5>
                    <CustomText
                        fontFamily="regular"
                        fontSize="sm"
                        color="darkTextColor">
                        {shipCity}
                    </CustomText>
                    <CustomText
                        fontFamily="regular"
                        fontSize="sm"
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
                            {shipRating}
                            | 20{' '}
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

                {/* <View marginV-16>
                    <Button
                        title={t('labelButtonShipHistory')}
                        onSubmit={() => {
                            handleShowCalendar();
                        }}
                    />
                    <CustomCalendar
                        visible={showCalendar}
                        onClose={handleShowCalendar}
                        // shipHistory={shipHistory}
                    />
                </View> */}
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
                    label={shipCategory || ''}
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
        </>
    );
};

export default DetailShipProfile;
