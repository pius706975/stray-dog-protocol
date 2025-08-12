import React from 'react';
import { Pressable } from 'react-native';
import { SearchBar } from '@rneui/themed';
import { Color, FontFamily, FontSize } from '../configs';
import { CustomSearchBarProps } from '../types';

const CustomSearchBar: React.FC<CustomSearchBarProps> = ({
    onPress,
    testId,
    placeholder,
}) => {
    return (
        <Pressable testID={testId} onPress={onPress}>
            <SearchBar
                pointerEvents="none"
                platform="android"
                placeholder={placeholder}
                containerStyle={{
                    height: 50,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: Color.softGreyBgPrimary,
                    borderRadius: 5,
                }}
                inputContainerStyle={{
                    backgroundColor: Color.softGreyBgPrimary,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 5,
                }}
                inputStyle={{
                    color: Color.darkTextColor,
                    fontFamily: FontFamily.regular,
                    fontSize: FontSize.lg,
                }}
                disabled
            />
        </Pressable>
    );
};

export default CustomSearchBar;
