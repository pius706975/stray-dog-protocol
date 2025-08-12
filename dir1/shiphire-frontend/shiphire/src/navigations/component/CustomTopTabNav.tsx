import React from 'react';
import { Pressable } from 'react-native';
import { Text } from 'react-native-ui-lib';
import { Color, FontFamily, FontSize } from '../../configs';
import { CustomTopNavbarType } from '../../types';

const CustomTopTabNav: React.FC<CustomTopNavbarType> = ({
    label,
    activeIndex,
    isActive,
    onPress,
}) => {
    return (
        <Pressable
            style={{
                flex: 1,
                paddingHorizontal: 20,
                paddingVertical: 10,
                borderBottomWidth: isActive ? 3 : 0,
                borderBottomColor:
                    activeIndex === 0
                        ? Color.boldWarningColor
                        : activeIndex === 1
                        ? Color.boldWarningColor
                        : activeIndex === 2
                        ? Color.boldWarningColor
                        : activeIndex === 3
                        ? Color.boldWarningColor
                        : activeIndex === 4
                        ? Color.boldWarningColor
                        : activeIndex === 5
                        ? Color.boldSuccessColor
                        : activeIndex === 6
                        ? Color.boldErrorColor
                        : 'transparent',
                backgroundColor: 'white',
            }}
            onPress={onPress}>
            <Text
                style={{
                    textAlign: 'center',
                    fontFamily: FontFamily.semiBold,
                    fontSize: FontSize.xs,
                    color:
                        isActive && activeIndex === 0
                            ? Color.boldWarningColor
                            : isActive && activeIndex === 1
                            ? Color.boldWarningColor
                            : isActive && activeIndex === 2
                            ? Color.boldWarningColor
                            : isActive && activeIndex === 3
                            ? Color.boldWarningColor
                            : isActive && activeIndex === 4
                            ? Color.boldWarningColor
                            : isActive && activeIndex === 5
                            ? Color.boldSuccessColor
                            : isActive && activeIndex === 6
                            ? Color.boldErrorColor
                            : Color.softPrimaryColor,
                }}>
                {label}
            </Text>
        </Pressable>
    );
};

export default CustomTopTabNav;
