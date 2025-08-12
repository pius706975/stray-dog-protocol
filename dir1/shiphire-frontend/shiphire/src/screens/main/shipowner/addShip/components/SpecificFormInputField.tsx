import {Input} from '@rneui/base';
import React from 'react';
import {Text, View} from 'react-native-ui-lib';
import {CustomText} from '../../../../../components';
import {FontFamily, FontSize, Color} from '../../../../../configs';
import {SpecificFormInputFieldProps} from '../../../../../types';

const SpecificFormInputField: React.FC<SpecificFormInputFieldProps> = ({
    onBlur,
    onChange,
    value,
    label,
    units,
}) => {
    return (
        <React.Fragment>
            <CustomText fontSize="sm" fontFamily="medium" color="darkTextColor">
                {label}
            </CustomText>
            <View
                style={{
                    width: '30%',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}>
                <Input
                    style={{
                        flex: 1,
                        borderColor: 'gray',
                        borderBottomWidth: 1,
                    }}
                    placeholderTextColor={'#4D596399'}
                    inputStyle={{
                        fontFamily: FontFamily.regular,
                        fontSize: FontSize.sm,
                        color: Color.darkTextColor,
                        textAlign: 'center',
                    }}
                    value={value}
                    onBlur={e => onBlur(e)}
                    onChangeText={e => onChange(e)}
                    keyboardType="numeric"
                />
                <Text
                    style={{
                        fontFamily: FontFamily.regular,
                        fontSize: FontSize.sm,
                        color: '#4D596399',
                    }}>
                    {units}
                </Text>
            </View>
        </React.Fragment>
    );
};

export default SpecificFormInputField;
