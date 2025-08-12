import React from 'react';
import { ActivityIndicator, Pressable } from 'react-native';
import { View } from 'react-native-ui-lib';
import { Color } from '../configs';
import { ButtonProps } from '../types';
import CustomText from './CustomText';

const CustomButton: React.FC<ButtonProps> = ({
    title,
    onSubmit,
    disable,
    isSubmitting,
    rightIcon,
    color,
    leftIcon,
    google = false,
    testID = undefined,
}) => {
    return isSubmitting ? (
        <ActivityIndicator
            style={{
                marginVertical: 10,
                paddingVertical: 6,
            }}
            size="large"
            color={
                color === 'success'
                    ? Color.boldSuccessColor
                    : color === 'warning'
                    ? Color.boldWarningColor
                    : color === 'error'
                    ? Color.boldErrorColor
                    : Color.primaryColor
            }
        />
    ) : (
        <Pressable
            testID={testID}
            style={{
                backgroundColor: disable
                    ? Color.primaryDisableColor
                    : color === 'success'
                    ? Color.boldSuccessColor
                    : color === 'warning'
                    ? Color.boldWarningColor
                    : color === 'error'
                    ? Color.boldErrorColor
                    : google
                    ? 'white'
                    : Color.primaryColor,
                paddingVertical: 6,
                paddingHorizontal: 10,
                borderRadius: 6,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: leftIcon ? 10 : 0,
                elevation: google ? 4 : 2,
            }}
            disabled={disable}
            onPress={() => onSubmit && onSubmit()}>
            {leftIcon && leftIcon}
            <CustomText
                fontFamily="medium"
                fontSize="md"
                color={`${google ? 'darkTextColor' : 'bgColor'}`}>
                {title}
            </CustomText>
            <View
                style={{
                    position: 'absolute',
                    right: 20,
                }}>
                {rightIcon}
            </View>
        </Pressable>
    );
};

export default CustomButton;
