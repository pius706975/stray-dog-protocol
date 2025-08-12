import { CheckBox } from '@rneui/base';
import React from 'react';
import { useWindowDimensions } from 'react-native';

import { Button, View } from 'react-native-ui-lib';
import {
    CheckboxCheckedIcon,
    CheckboxIcon,
    Color,
    TrashIcon,
} from '../../../../../../configs';
import {
    CustomText,
    TextInput,
    TextInputError,
} from '../../../../../../components';
import CustomButton from '../../../../../../components/Button';

function AdditionalInput({
    fieldType,
    setFieldValue,
    handleBlur,
    handleChange,
    touched,
    errors,
    values,
    radioItem,
    setRadioItem,
}) {
    const { width } = useWindowDimensions();

    const [multilineCheck, setMultilineCheck] = React.useState<boolean>(false);
    const [expiredCheck, setExpiredCheck] = React.useState<boolean>(false);
    const [radioChange, setRadioChange] = React.useState<string>('');

    return (
        <View>
            {fieldType === 'selectDropDown' && (
                <TextInput
                    leftIcon
                    placeholder="0"
                    label="Pick Minimum"
                    onBlur={handleBlur('min')}
                    onChange={handleChange('min')}
                    error={touched.min && errors.min}
                    value={values.min}
                    keyboardType="number-pad"
                />
            )}
            {fieldType === 'textInput' && (
                <View>
                    <CheckBox
                        testID="multiline-checkbox"
                        checked={multilineCheck}
                        checkedIcon={<CheckboxCheckedIcon />}
                        uncheckedIcon={<CheckboxIcon />}
                        onPress={() => {
                            setMultilineCheck(!multilineCheck);
                            setFieldValue('required', !multilineCheck);
                        }}
                        wrapperStyle={{
                            gap: 12,
                        }}
                        title={'Multiline'}
                        containerStyle={{
                            width: width / 1.4,
                            justifyContent: 'center',
                            alignItems: 'flex-start',
                            backgroundColor: Color.bgColor,
                        }}
                    />
                </View>
            )}
            {fieldType === 'numericInput' && (
                <View>
                    <View>
                        <TextInput
                            leftIcon
                            placeholder="Unit"
                            label="Unit"
                            onBlur={handleBlur('unit')}
                            onChange={handleChange('unit')}
                            error={touched.unit && errors.unit}
                            value={values.unit}
                        />
                        {touched.unit && errors.unit && (
                            <TextInputError errorText={errors.unit} />
                        )}
                    </View>
                    <View>
                        <TextInput
                            leftIcon
                            placeholder="0"
                            label="Minimum Number"
                            onBlur={handleBlur('min')}
                            onChange={handleChange('min')}
                            error={touched.min && errors.min}
                            value={values.min}
                            keyboardType="number-pad"
                        />
                        {touched.min && errors.min && (
                            <TextInputError errorText={errors.min} />
                        )}
                    </View>
                    <View>
                        <TextInput
                            leftIcon
                            placeholder="0"
                            label="Maximum Number"
                            onBlur={handleBlur('max')}
                            onChange={handleChange('max')}
                            error={touched.max && errors.max}
                            value={values.max}
                            keyboardType="number-pad"
                        />
                        {touched.max && errors.max && (
                            <TextInputError errorText={errors.max} />
                        )}
                    </View>
                </View>
            )}
            {fieldType === 'radioDropdown' && (
                <View>
                    <View row>
                        <View style={{ width: '80%' }}>
                            <TextInput
                                leftIcon
                                placeholder={`Item`}
                                label={`Item`}
                                onBlur={handleBlur('unit')}
                                onChange={e => setRadioChange(e)}
                                error={touched.unit && errors.unit}
                            />
                        </View>
                        <View style={{ justifyContent: 'center' }}>
                            <CustomButton
                                testID="btn-radio-add"
                                title="Add"
                                disable={radioChange == ''}
                                onSubmit={() =>
                                    setRadioItem([
                                        ...radioItem,
                                        {
                                            id: Date.now(),
                                            value: radioChange,
                                        },
                                    ])
                                }
                            />
                        </View>
                    </View>
                    <View paddingH-10>
                        <CustomText
                            fontFamily="regular"
                            fontSize="lg"
                            color="primaryColor">
                            Options
                        </CustomText>
                        {radioItem.map((item, index) => (
                            <View
                                key={index}
                                marginB-10
                                row
                                style={{
                                    justifyContent: 'space-between',
                                }}>
                                <CustomText
                                    key={`item-${index}`}
                                    fontFamily="regular"
                                    fontSize="lg"
                                    color="darkTextColor">
                                    - {item.value}
                                </CustomText>
                                <Button
                                    testID="btn-option-delete"
                                    backgroundColor={Color.softSecBgPrimary}
                                    padding-4
                                    iconSource={() => <TrashIcon />}
                                    onPress={() =>
                                        setRadioItem(prevItems =>
                                            prevItems.filter(
                                                prevItem =>
                                                    prevItem.id !== item.id,
                                            ),
                                        )
                                    }
                                />
                            </View>
                        ))}
                    </View>
                </View>
            )}
            {fieldType === 'docSelect' && (
                <View>
                    <CheckBox
                        testID="expired-checkbox"
                        checked={expiredCheck}
                        checkedIcon={<CheckboxCheckedIcon />}
                        uncheckedIcon={<CheckboxIcon />}
                        onPress={() => {
                            setExpiredCheck(!expiredCheck);
                            setFieldValue('expired', !expiredCheck);
                        }}
                        wrapperStyle={{
                            gap: 12,
                        }}
                        title={'Document Expired Field'}
                        containerStyle={{
                            width: width / 1.4,
                            justifyContent: 'center',
                            alignItems: 'flex-start',
                            backgroundColor: Color.bgColor,
                        }}
                    />
                </View>
            )}
        </View>
    );
}

export default AdditionalInput;
