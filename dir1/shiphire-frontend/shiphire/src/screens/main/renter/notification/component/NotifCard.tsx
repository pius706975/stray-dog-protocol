import React from 'react';
import { Pressable, useWindowDimensions } from 'react-native';
import { Text, View } from 'react-native-ui-lib';
import { CustomText } from '../../../../../components';
import {
    Color,
    ContractIcon,
    FontFamily,
    FontSize,
    ProposalIcon,
    RFQIcon,
    ShipIcon,
} from '../../../../../configs';
import { useUserOpenNotif } from '../../../../../hooks';
import { NotifCardProps } from '../../../../../types';
import { handleAxiosError } from '../../../../../utils';

const NotifCard: React.FC<NotifCardProps> = ({
    docType,
    body,
    title,
    time,
    navigation,
    shipId,
    transactionId,
    rentalId,
    notifId,
    testId,
}) => {
    const { width } = useWindowDimensions();
    const mutationUserOpenNotif = useUserOpenNotif();

    const handleAppInfoPressed = () => {
        if (shipId) {
            navigation.navigate('DetailShip', {
                shipId: shipId ? shipId : '',
            });
        } else {
            if (transactionId && rentalId) {
                navigation.navigate('Payment', {
                    rentalId,
                    transactionId,
                });
            }
        }
        mutationUserOpenNotif.mutate(
            { notifId },
            {
                onSuccess: () => {
                    console.log('success');
                },
                onError: err => {
                    handleAxiosError(err);
                },
            },
        );
    };

    return (
        <Pressable
            testID={testId}
            style={{
                backgroundColor: Color.bgNeutralColor,
                padding: 10,
                borderRadius: 6,
                flexDirection: 'row',
                gap: 10,
                alignItems: 'center',
            }}
            onPress={docType === 'appInfo' ? handleAppInfoPressed : () => {}}>
            <View
                style={{
                    width: 40,
                    height: 40,
                    backgroundColor: Color.primaryColor,
                    borderRadius: 6,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                {docType === 'rfq' ? (
                    <RFQIcon />
                ) : docType === 'contract' ? (
                    <ContractIcon />
                ) : docType === 'proposal' ? (
                    <ProposalIcon />
                ) : (
                    <ShipIcon />
                )}
            </View>
            <View row flex centerV style={{ justifyContent: 'space-between' }}>
                <View style={{ width: width / 1.6 }}>
                    <CustomText
                        color="darkTextColor"
                        fontSize="md"
                        fontFamily="bold"
                        ellipsizeMode>
                        {title}
                    </CustomText>
                    <Text
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        style={{
                            fontSize: FontSize.xs,
                            fontFamily: FontFamily.regular,
                            color: Color.neutralColor,
                        }}>
                        {body}
                    </Text>
                </View>
                <Text
                    style={{
                        fontSize: FontSize.xs,
                        fontFamily: FontFamily.medium,
                    }}>
                    {time}
                </Text>
            </View>
        </Pressable>
    );
};

export default NotifCard;
