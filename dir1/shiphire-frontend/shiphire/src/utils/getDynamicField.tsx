import { FormikProps } from 'formik';
import React, { Dispatch } from 'react';
import { DocumentPickerResponse } from 'react-native-document-picker';
import { ImageOrVideo } from 'react-native-image-crop-picker';
import {
    DynamicDatePicker,
    DynamicDatePickerCalendar,
    DynamicDocSelect,
    DynamicImageSelect,
    DynamicNumericInput,
    DynamicRadioDropdown,
    DynamicSelectDropdown,
    DynamicTextField,
} from '../components';
import { shipSpecSlice } from '../slices';
import { DynamicFormType } from '../types';

const getDynamicField = (
    data: DynamicFormType,
    formikProps: FormikProps<any>,
    dispatch: Dispatch<any>,
    shipId?: string | String,
) => {
    if (data.dynamicInput.inputType === 'textInput') {
        if (formikProps.values[data.dynamicInput.fieldName] === undefined) {
            formikProps.setFieldValue(data.dynamicInput.fieldName, '');
        }
        return (
            <DynamicTextField
                label={data.dynamicInput.label}
                placeholder={
                    data.dynamicInput.placeholder
                        ? data.dynamicInput.placeholder
                        : ''
                }
                onBlur={formikProps.handleBlur(data.dynamicInput.fieldName)}
                onChange={formikProps.handleChange(data.dynamicInput.fieldName)}
                multiline={data.validation?.multiline}
                error={
                    formikProps.touched[data.dynamicInput.fieldName] &&
                    formikProps.errors[data.dynamicInput.fieldName]
                }
                value={formikProps.values[data.dynamicInput.fieldName]}
                errorText={formikProps.errors[
                    data.dynamicInput.fieldName
                ]?.toString()}
            />
        );
    } else if (data.dynamicInput.inputType === 'numericInput') {
        if (!formikProps.values[data.dynamicInput.fieldName] === undefined) {
            formikProps.setFieldValue(data.dynamicInput.fieldName, 0);
        }
        return (
            <DynamicNumericInput
                label={data.dynamicInput.label}
                error={formikProps.errors[data.dynamicInput.fieldName]}
                value={formikProps.values[data.dynamicInput.fieldName]}
                onChange={e =>
                    formikProps.setFieldValue(data.dynamicInput.fieldName, e)
                }
                errorText={formikProps.errors[
                    data.dynamicInput.fieldName
                ]?.toString()}
                unit={data.dynamicInput.unit ? data.dynamicInput.unit : ''}
            />
        );
    } else if (data.dynamicInput.inputType === 'datePicker') {
        if (!formikProps.values[data.dynamicInput.fieldName]) {
            formikProps.setFieldValue(data.dynamicInput.fieldName, new Date());
        }
        return (
            <DynamicDatePicker
                label={data.dynamicInput.label}
                placeholder={
                    data.dynamicInput.placeholder
                        ? data.dynamicInput.placeholder
                        : ''
                }
                minDate={
                    data.dynamicInput.fieldName === 'rentalStartDate'
                        ? new Date()
                        : formikProps.values['rentalStartDate']
                }
                onChange={e =>
                    formikProps.setFieldValue(data.dynamicInput.fieldName, e)
                }
                value={
                    !formikProps.values[data.dynamicInput.fieldName]
                        ? new Date()
                        : formikProps.values[data.dynamicInput.fieldName]
                }
            />
        );
    } else if (data.dynamicInput.inputType === 'datePickerCalendar') {
        if (!formikProps.values[data.dynamicInput.fieldName] === undefined) {
            formikProps.setFieldValue(data.dynamicInput.fieldName, '');
        }
        let shipRentTypeStat;
        if (formikProps.values['shipRentType']) {
            shipRentTypeStat = formikProps.values['shipRentType'];
        }
        return (
            <DynamicDatePickerCalendar
                label={data.dynamicInput.label}
                placeholder={
                    data.dynamicInput.placeholder
                        ? data.dynamicInput.placeholder
                        : ''
                }
                value={formikProps.values[data.dynamicInput.fieldName]}
                shipId={shipId}
                error={formikProps.errors[data.dynamicInput.fieldName]}
                errorText={formikProps.errors[
                    data.dynamicInput.fieldName
                ]?.toString()}
                onChange={e =>
                    formikProps.setFieldValue(data.dynamicInput.fieldName, e)
                }
                shipRentType={shipRentTypeStat}
            />
        );
    } else if (data.dynamicInput.inputType === 'radioDropdown') {
        if (formikProps.values[data.dynamicInput.fieldName] === undefined) {
            formikProps.setFieldValue(data.dynamicInput.fieldName, '');
        }
        return (
            <DynamicRadioDropdown
                testID={`radio-dropdown-${data.dynamicInput.fieldName}`}
                label={data.dynamicInput.label}
                items={data.option.map(item => ({
                    label: item.value,
                    value: item.value,
                    testID: `item-${item.value}`,
                }))}
                onSetValue={e =>
                    formikProps.setFieldValue(data.dynamicInput.fieldName, e)
                }
                error={
                    formikProps.touched[data.dynamicInput.fieldName] &&
                    formikProps.errors[data.dynamicInput.fieldName]
                }
                errorText={formikProps.errors[
                    data.dynamicInput.fieldName
                ]?.toString()}
            />
        );
    } else if (
        data.dynamicInput.inputType === 'selectDropDown' &&
        data.dynamicInput.label === 'Ship Specification'
    ) {
        const { addShipSpecs } = shipSpecSlice.actions;

        if (formikProps.values[data.dynamicInput.fieldName] === undefined) {
            formikProps.setFieldValue(data.dynamicInput.fieldName, []);
        }

        return (
            <DynamicSelectDropdown
                testID={`dropdown-spec`}
                items={data.option.map(item => ({
                    label: item.value,
                    value: item.value,
                    testID: `item-${item.value}`,
                }))}
                label={data.dynamicInput.label}
                onSetValue={e => {
                    let shipSpec: string[] = [];
                    return (
                        formikProps.setFieldValue(
                            data.dynamicInput.fieldName,
                            e.map(item => item.value),
                        ),
                        e.map(item => {
                            return shipSpec.push(
                                item.label?.toString() as string,
                            );
                        }),
                        dispatch(addShipSpecs(shipSpec))
                    );
                }}
                error={
                    formikProps.touched[data.dynamicInput.fieldName] &&
                    formikProps.errors[data.dynamicInput.fieldName]
                }
                errorText={formikProps.errors[
                    data.dynamicInput.fieldName
                ]?.toString()}
            />
        );
    } else if (data.dynamicInput.inputType === 'selectDropDown') {
        if (formikProps.values[data.dynamicInput.fieldName] === undefined) {
            formikProps.setFieldValue(data.dynamicInput.fieldName, []);
        }

        return (
            <DynamicSelectDropdown
                testID={`dropdown-${data.dynamicInput.fieldName}`}
                items={data.option.map(item => ({
                    label: item.value,
                    value: item.value,
                    testID: `item-${item.value}`,
                }))}
                label={data.dynamicInput.label}
                onSetValue={e => {
                    formikProps.setFieldValue(
                        data.dynamicInput.fieldName,
                        e.map(item => item.value),
                    );
                }}
                error={
                    formikProps.touched[data.dynamicInput.fieldName] &&
                    formikProps.errors[data.dynamicInput.fieldName]
                }
                errorText={formikProps.errors[
                    data.dynamicInput.fieldName
                ]?.toString()}
            />
        );
    } else if (data.dynamicInput.inputType === 'docSelect') {
        if (formikProps.values[data.dynamicInput.fieldName] === undefined) {
            formikProps.setFieldValue(data.dynamicInput.fieldName, {});
        }
        return (
            <DynamicDocSelect
                testID={`doc-${data.dynamicInput.fieldName}`}
                label={data.dynamicInput.label}
                docExpired={data.dynamicInput.docExpired}
                setSelectedValue={(e: DocumentPickerResponse, date?: Date) => {
                    formikProps.setFieldValue(data.dynamicInput.fieldName, {
                        ...e,
                        docExpired: date?.toISOString(),
                    });
                }}
                setUnselectValue={() => {
                    formikProps.setFieldValue(
                        data.dynamicInput.fieldName,
                        undefined,
                    );
                }}
                error={
                    formikProps.touched[data.dynamicInput.fieldName] &&
                    formikProps.errors[data.dynamicInput.fieldName]
                }
                errorText={formikProps.errors[
                    data.dynamicInput.fieldName
                ]?.toString()}
            />
        );
    } else if (data.dynamicInput.inputType === 'imageSelect') {
        if (formikProps.values[data.dynamicInput.fieldName] === undefined) {
            formikProps.setFieldValue(data.dynamicInput.fieldName, {});
        }
        return (
            <DynamicImageSelect
                testID={`image-${data.dynamicInput.fieldName}`}
                label={data.dynamicInput.label}
                setSelectedValue={(e: ImageOrVideo) => {
                    formikProps.setFieldValue(data.dynamicInput.fieldName, e);
                }}
                setUnselectValue={() => {
                    formikProps.setFieldValue(
                        data.dynamicInput.fieldName,
                        undefined,
                    );
                }}
                error={
                    formikProps.touched[data.dynamicInput.fieldName] &&
                    formikProps.errors[data.dynamicInput.fieldName]
                }
                errorText={formikProps.errors[
                    data.dynamicInput.fieldName
                ]?.toString()}
            />
        );
    }
};

export default getDynamicField;
