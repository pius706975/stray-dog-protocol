import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { View } from 'react-native-ui-lib';
import { Color, FontFamily, FontSize } from '../configs';
import { BasicButtonProps } from '../types';

const BasicButton: React.FC<BasicButtonProps> = ({
    label,
    onClick = () => {},
    customStyles = {},
}) => {
    return (
        <Pressable onPress={onClick}>
            <View style={[styles.button, customStyles]}>
                <Text style={[styles.buttonText, customStyles]}>{label}</Text>
            </View>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    button: {
        padding: 7,
        borderRadius: 6,
        backgroundColor: Color.primaryColor,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        fontSize: FontSize.xs,
        fontFamily: FontFamily.regular,
        color: Color.lightTextColor,
    },
});

export default BasicButton;
