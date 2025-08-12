import React from 'react';
import { Image, Pressable, useWindowDimensions } from 'react-native';
import { Button, CustomText } from '../../../../../components';
import { Color } from '../../../../../configs';
import { View } from 'react-native-ui-lib';
import getAdminShipStatusText from '../../../../../utils/getAdminShipStatusText';

const ShipCardAdminManage = ({
    onPress,
    shipImage,
    shipName,
    shipCategory,
    shipCompany,
    status,
    index,
}) => {
    const { width } = useWindowDimensions();
    const statusText = getAdminShipStatusText(status);
    const backgroundColor =
        status === true ? Color.warningColor : Color.boldErrorColor;
    return (
        <Pressable onPress={onPress} testID={`ship-item-${index}`}>
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
                            backgroundColor: backgroundColor,
                            borderTopStartRadius: 10,
                            borderBottomEndRadius: 10,
                        }}>
                        <CustomText
                            fontSize="xs"
                            fontFamily="medium"
                            color="lightTextColor"
                            textAlign="center">
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
                                Ship Category
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
                                : {shipCategory}
                            </CustomText>
                        </View>
                    </View>
                </View>
                <View
                    row
                    style={{
                        marginHorizontal: 8,
                        marginBottom: 8,
                        justifyContent: 'flex-end',
                    }}>
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

export default ShipCardAdminManage;
