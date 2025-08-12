import { Input } from '@rneui/themed';
import React from 'react';
import { Pressable, View } from 'react-native';
import { Color, FontFamily, FontSize } from '../configs';
import CustomText from './CustomText';
import { TextInputProps } from '../types';

const TextInput: React.FC<TextInputProps> = ({
    editable = true,
    label,
    leftIcon,
    onBlur,
    onChange,
    placeholder,
    rightIcon,
    onIconTouch,
    secureTextEntry,
    error,
    value,
    multiline = false,
    rightIconTestId,
    keyboardType,
    onPress,
    fullBorder,
}) => {
    return (
        <Pressable
            style={{
                width: '100%',
            }}
            onPress={onPress}>
            {label && (
                <View style={{ paddingLeft: 10 }}>
                    <CustomText
                        fontSize="xl"
                        fontFamily="medium"
                        color="primaryColor">
                        {label}
                    </CustomText>
                </View>
            )}
            <View>
                <Input
                    pointerEvents={editable ? 'auto' : 'none'}
                    inputContainerStyle={{
                        borderColor: error
                            ? Color.errorColor
                            : Color.primaryColor,
                        borderWidth: fullBorder ? 1 : 0,
                        borderRadius: fullBorder ? 10 : 0,
                    }}
                    inputStyle={{
                        fontFamily: FontFamily.regular,
                        fontSize: FontSize.md,
                        color: Color.darkTextColor,
                    }}
                    leftIcon={leftIcon}
                    placeholder={placeholder}
                    editable={editable}
                    secureTextEntry={secureTextEntry}
                    multiline={multiline}
                    onBlur={onBlur ? e => onBlur(e) : undefined}
                    onChangeText={onChange ? e => onChange(e) : undefined}
                    value={value}
                    keyboardType={keyboardType}
                />
                <Pressable
                    style={{
                        position: 'absolute',
                        right: 14,
                        top: 15,
                    }}
                    onPress={onIconTouch}
                    testID={rightIconTestId}>
                    {rightIcon}
                </Pressable>
            </View>
        </Pressable>
    );
};

export default TextInput;
