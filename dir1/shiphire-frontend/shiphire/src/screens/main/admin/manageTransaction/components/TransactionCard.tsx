import React from 'react';
import { Image, Pressable, useWindowDimensions } from 'react-native';
import { Button, CustomText } from '../../../../../components';
import { Color } from '../../../../../configs';
import { View } from 'react-native-ui-lib';
import { getAdminStatusText } from '../../../../../utils';
import moment from 'moment';

const TransactionCard = ({
    testID,
    status,
    onPress,
    shipImage,
    shipName,
    rentalId,
    totalRent,
    shipCompany,
    timeStamp,
}) => {
    const { width } = useWindowDimensions();
    const statusText = getAdminStatusText(status);
    const humanizedTimeStamp = moment(timeStamp).format('D MMMM YYYY, h:mm A');

    return (
        <Pressable testID={testID} onPress={onPress}>
            <View
                style={{
                    backgroundColor: Color.primaryColor,
                    borderRadius: 10,
                }}>
                <View row flex style={{ alignContent: 'space-between' }}>
                    <View
                        center
                        style={{
                            borderWidth: 1,
                            minWidth: width / 3,
                            paddingHorizontal: 8,
                            backgroundColor: Color.boldWarningColor,
                            borderTopStartRadius: 10,
                            borderBottomEndRadius: 10,
                        }}>
                        <CustomText
                            fontSize="xs"
                            fontFamily="medium"
                            color="lightTextColor">
                            {statusText}
                        </CustomText>
                    </View>
                    <View flex paddingR-8>
                        <CustomText
                            fontSize="xs"
                            fontFamily="medium"
                            color="lightTextColor"
                            textAlign="right">
                            {shipCompany}
                        </CustomText>
                    </View>
                </View>
                <View row>
                    <Image
                        source={{
                            uri: shipImage,
                        }}
                        style={{
                            width: 80,
                            height: 80,
                            margin: 12,
                            borderRadius: 12,
                        }}
                    />
                    <View style={{ justifyContent: 'center' }}>
                        <View marginV-4>
                            <CustomText
                                fontSize="xs"
                                fontFamily="medium"
                                color="lightTextColor">
                                Ship Name
                            </CustomText>
                        </View>
                        <View marginV-4>
                            <CustomText
                                fontSize="xs"
                                fontFamily="medium"
                                color="lightTextColor">
                                Rental ID
                            </CustomText>
                        </View>
                        <View marginV-4>
                            <CustomText
                                fontSize="xs"
                                fontFamily="medium"
                                color="lightTextColor">
                                Total Rental
                            </CustomText>
                        </View>
                    </View>
                    <View
                        style={{
                            justifyContent: 'center',
                            paddingStart: 4,
                        }}>
                        <View marginV-4>
                            <CustomText
                                fontSize="xs"
                                fontFamily="medium"
                                color="lightTextColor">
                                : {shipName}
                            </CustomText>
                        </View>
                        <View marginV-4>
                            <CustomText
                                fontSize="xs"
                                fontFamily="medium"
                                color="lightTextColor">
                                : {rentalId}
                            </CustomText>
                        </View>
                        <View marginV-4>
                            <CustomText
                                fontSize="xs"
                                fontFamily="medium"
                                color="lightTextColor">
                                : Rp. {totalRent}
                            </CustomText>
                        </View>
                    </View>
                </View>
                <View
                    row
                    style={{
                        marginHorizontal: 8,
                        marginBottom: 8,
                    }}>
                    <View flex style={{ justifyContent: 'center' }}>
                        <CustomText
                            fontSize="xs"
                            fontFamily="medium"
                            color="lightTextColor">
                            {humanizedTimeStamp}
                        </CustomText>
                    </View>
                    <Button
                        title="Detail >"
                        color="primary"
                        onSubmit={() => onPress()}
                    />
                </View>
            </View>
        </Pressable>
    );
};

export default TransactionCard;
