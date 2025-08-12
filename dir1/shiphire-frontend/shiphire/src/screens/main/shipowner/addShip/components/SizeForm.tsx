import {Input} from '@rneui/base';
import React from 'react';
import {View} from 'react-native';
import {FontFamily, FontSize, Color} from '../../../../../configs';
import {SizeFormProps} from '../../../../../types';

const SizeForm: React.FC<SizeFormProps> = ({
    value,
    onChange,
    onBlur,
    placeholder,
}) => {
    return (
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
                placeholder={placeholder}
                value={value}
                onChangeText={value => onChange(value)}
                onBlur={value => onBlur(value)}
                keyboardType="numeric"
            />
        </View>
    );
};

export default SizeForm;
