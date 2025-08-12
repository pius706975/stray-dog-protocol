import React from 'react';
import { Text, View } from 'react-native-ui-lib';
import { FontFamily, FontSize, Color } from '../../../../../configs';
import { CompanyFieldProps } from '../../../../../types';

const CompanyField: React.FC<CompanyFieldProps> = ({
    shipOwnerDataLabel,
    shipOwnerDataValue,
}) => {
    return (
        <View
            style={{
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                padding: 5,
                borderBottomWidth: 1,
            }}>
            <Text
                style={{
                    fontFamily: FontFamily.regular,
                    fontSize: FontSize.xl,
                    color: Color.primaryColor,
                }}>
                {shipOwnerDataLabel}
            </Text>
            <Text
                style={{
                    fontFamily: FontFamily.regular,
                    fontSize: FontSize.lg,
                    color: Color.darkTextColor,
                }}>
                {shipOwnerDataValue}
            </Text>
        </View>
    );
};

export default CompanyField;
