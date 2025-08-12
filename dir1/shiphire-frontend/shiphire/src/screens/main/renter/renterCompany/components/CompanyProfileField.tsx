import React from 'react';
import {Text, View} from 'react-native-ui-lib';
import {FontFamily, FontSize, Color} from '../../../../../configs';
import {CompanyProfileFieldProps} from '../../../../../types';

const CompanyProfileField: React.FC<CompanyProfileFieldProps> = ({
    renterDataLabel,
    renterDataValue,
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
                {renterDataLabel}
            </Text>
            <Text
                style={{
                    fontFamily: FontFamily.regular,
                    fontSize: FontSize.lg,
                    color: Color.darkTextColor,
                }}>
                {renterDataValue}
            </Text>
        </View>
    );
};

export default CompanyProfileField;
