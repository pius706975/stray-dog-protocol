import React from 'react';
import { View } from 'react-native-ui-lib';
import { Pressable } from 'react-native';
import { AccountMenuItemProps } from '../../../../../types';
import { CustomText } from '../../../../../components';
import { RightIcon } from '../../../../../configs';

const AccountMenuItem: React.FC<AccountMenuItemProps> = ({
    onClick,
    label,
    Icon,
}) => {
    return (
        <Pressable onPress={onClick}>
            <View
                style={{
                    padding: 10,
                    paddingTop: 0,
                    borderBottomWidth: 0.5,
                    margin: 5,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}>
                <View
                    style={{
                        flexDirection: 'row',
                    }}>
                    <View
                        style={{
                            justifyContent: 'flex-start',
                            padding: 5,
                            paddingRight: 10,
                            paddingLeft: 0,
                        }}>
                        <Icon />
                    </View>

                    <CustomText
                        fontFamily="regular"
                        fontSize="md"
                        color="darkTextColor">
                        {label}
                    </CustomText>
                </View>
                <RightIcon />
            </View>
        </Pressable>
    );
};

export default AccountMenuItem;
