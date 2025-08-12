import React from 'react';
import { View, Pressable } from 'react-native';
import { CustomText } from '../../../../../components';
import { DocumentMenuItemProps } from '../../../../../types';

const DocumentMenuItem: React.FC<DocumentMenuItemProps> = ({
    onClick,
    label,
    Icon,
    paddingLeft,
}) => {
    return (
        <View
            style={{
                padding: 5,
            }}>
            <Pressable onPress={() => onClick()}>
                <View
                    style={{
                        paddingLeft: paddingLeft,
                    }}>
                    <Icon />
                </View>
                <View>
                    <CustomText
                        fontFamily="regular"
                        fontSize="sm"
                        color="darkTextColor">
                        {label}
                    </CustomText>
                </View>
            </Pressable>
        </View>
    );
};

export default DocumentMenuItem;
