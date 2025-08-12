import React from 'react';
import { Pressable } from 'react-native';
import { Image, View } from 'react-native-ui-lib';
import { Color } from '../../../../../configs';
import { CustomText } from '../../../../../components';
import { ShipReminderCardProps } from '../../../../../types';
import { useTranslation } from 'react-i18next';

const ShipReminderCard: React.FC<ShipReminderCardProps> = ({
    navigation,
    imageUrl,
    reminderDate,
    shipName,
    shipId,
    testID,
}) => {
    const { t } = useTranslation('account');
    return (
        <Pressable
            testID={`ship-${shipId}`}
            onPress={() => navigation.navigate('DetailShip', { shipId })}
            style={{
                padding: 16,
                backgroundColor: Color.bgNeutralColor,
                borderRadius: 10,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 10,
            }}>
            <Image
                source={{
                    uri: imageUrl,
                }}
                style={{
                    height: 80,
                    width: 100,
                }}
            />
            <View>
                <CustomText
                    fontSize="lg"
                    fontFamily="bold"
                    color="primaryColor"
                    ellipsizeMode
                    numberOfLines={1}>
                    {shipName}
                </CustomText>
                <CustomText
                    fontSize="md"
                    fontFamily="medium"
                    color="softPrimaryColor">
                    {t('RemindedShips.textReminderSetOn')}
                </CustomText>
                <CustomText
                    fontSize="md"
                    fontFamily="regular"
                    color="darkTextColor">
                    {reminderDate}
                </CustomText>
            </View>
        </Pressable>
    );
};

export default ShipReminderCard;
