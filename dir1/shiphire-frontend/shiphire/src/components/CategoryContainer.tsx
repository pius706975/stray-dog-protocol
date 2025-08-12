import React from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Text, View } from 'react-native-ui-lib';
import { Color, FontFamily } from '../configs';
import { CategoryContainerProps } from '../types';

const CategoryContainer: React.FC<CategoryContainerProps> = ({
    index,
    label,
    onPress,
    testId,
}) => {
    return (
        <TouchableOpacity onPress={onPress} testID={`${testId}`}>
            <View
                style={{
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    minWidth: 60,
                    borderWidth: 2,
                    borderColor: Color.softPrimaryColor,
                    marginHorizontal: 6,
                    borderRadius: 10,
                    backgroundColor: Color.softSecColor,
                    alignItems: 'center',
                }}>
                <Text
                    style={{
                        fontFamily: FontFamily.medium,
                        color: Color.primaryColor,
                    }}>
                    {label}
                </Text>
            </View>
        </TouchableOpacity>
    );
};

export default CategoryContainer;
