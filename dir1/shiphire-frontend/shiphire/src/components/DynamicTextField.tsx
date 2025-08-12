import React from 'react';
import { View } from 'react-native-ui-lib';
import { DynamicTextFieldProps } from '../types';
import TextInput from './TextInput';
import TextInputError from './TextInputError';

const DynamicTextField: React.FC<DynamicTextFieldProps> = ({
    label,
    placeholder,
    onBlur,
    onChange,
    value,
    multiline = false,
    keyboardType,
    error,
    editable,
    leftIcon,
    onPress,
    errorText,
}) => {
    return (
        <View
            style={{
                paddingTop: 20,
                margin: -10,
            }}>
            <TextInput
                leftIcon={leftIcon}
                placeholder={placeholder}
                label={label}
                onBlur={onBlur}
                onChange={onChange}
                multiline={multiline}
                error={error}
                value={value}
                onPress={onPress}
                editable={editable}
                keyboardType={keyboardType}
            />
            {error && <TextInputError errorText={errorText ? errorText : ''} />}
        </View>
    );
};

export default DynamicTextField;
