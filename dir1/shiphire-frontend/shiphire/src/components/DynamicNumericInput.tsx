import { FormikErrors } from 'formik';
import React from 'react';
import NumericInput from 'react-native-numeric-input';
import { View } from 'react-native-ui-lib';
import { Color } from '../configs';
import CustomText from './CustomText';
import TextInputError from './TextInputError';

const DynamicNumericInput: React.FC<{
    label: string;
    value: number;
    onChange: (value: number) => void;
    error?: string | FormikErrors<any> | string[] | FormikErrors<any>[];
    errorText?: string;
    unit: string;
}> = ({ value, onChange, error, errorText, label, unit }) => {
    return (
        <View>
            <CustomText fontFamily="medium" fontSize="xl" color="primaryColor">
                {label}
            </CustomText>
            <View row centerV marginT-16 style={{ gap: 10 }}>
                <NumericInput
                    type="up-down"
                    totalWidth={200}
                    totalHeight={50}
                    step={10}
                    minValue={0}
                    rounded
                    value={value}
                    textColor={Color.darkTextColor}
                    upDownButtonsBackgroundColor={Color.softPrimaryColor}
                    borderColor={Color.primaryColor}
                    onChange={onChange}
                />
                <CustomText
                    fontFamily="regular"
                    fontSize="md"
                    color="darkTextColor">
                    {unit}
                </CustomText>
            </View>
            {error && (
                <View
                    style={{
                        marginTop: 26,
                        marginLeft: -10,
                    }}>
                    <TextInputError errorText={errorText ? errorText : ''} />
                </View>
            )}
        </View>
    );
};

export default DynamicNumericInput;
