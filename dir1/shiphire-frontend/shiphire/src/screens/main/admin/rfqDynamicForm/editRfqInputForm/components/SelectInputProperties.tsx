import React from 'react';
import { Button, Text, View } from 'react-native-ui-lib';
import { CheckBox } from '@rneui/base';

import DropDownPicker from 'react-native-dropdown-picker';
import { useWindowDimensions } from 'react-native';
import { Formik, FormikHelpers, FormikProps } from 'formik';
import * as yup from 'yup';
import { useDispatch } from 'react-redux';
import { modalSlice } from '../../../../../../slices';
import {
    useAddDynamicInputDropDownItem,
    useRemoveItemDropdownDynamicInput,
} from '../../../../../../hooks';
import { handleAxiosError } from '../../../../../../utils';
import {
    CheckboxCheckedIcon,
    CheckboxIcon,
    Color,
    FontFamily,
    FontSize,
    TrashIcon,
} from '../../../../../../configs';
import {
    CustomText,
    TextInput,
    TextInputError,
} from '../../../../../../components';
import CustomButton from '../../../../../../components/Button';

type SelectInputRequest = {
    label?: string;
    fieldType: string;
    required?: boolean;
    unit?: string;
};
const SelectInputProperties = ({ selectItem, setSelectItem, templateType }) => {
    const { width } = useWindowDimensions();
    const dispatch = useDispatch();
    const { hideModal, showModal } = modalSlice.actions;
    const [selectChange, setSelectChange] = React.useState('');
    const [selectFieldType, setSelectFieldType] = React.useState('');
    const [openPicker, setOpenPicker] = React.useState(false);
    const [pickerItem, setPickerItem] = React.useState([
        {
            label: 'Text Input',
            value: 'textInput',
        },
        {
            label: 'Numeric Input',
            value: 'numericInput',
        },
    ]);
    const [selectCheck, setselectCheck] = React.useState(false);

    const formValidationScheme: yup.ObjectSchema<
        SelectInputRequest & { required?: boolean }
    > = yup.object().shape({
        label: yup.string(),
        fieldType: yup.string().required('field type is required.'),
        required: yup.boolean(),
        unit: yup.string(),
    });
    const formikInitialValues: SelectInputRequest = {
        fieldType: '',
        required: true,
        unit: '',
    };

    const mutationAddDynamicInputDropDownItem =
        useAddDynamicInputDropDownItem();
    const mutationRemoveItemDropdownDynamicInput =
        useRemoveItemDropdownDynamicInput();

    const handleDeleteItem = (id: number) => {
        setSelectItem(prevItems =>
            prevItems.filter(prevItem => prevItem.id !== id),
        );
    };
    const handleDeleteInput = (itemId: string | undefined) => {
        mutationRemoveItemDropdownDynamicInput.mutate(
            { id: itemId },
            {
                onSuccess: () => {
                    dispatch(
                        showModal({
                            status: 'success',
                            text: 'remove input success',
                        }),
                    );

                    setTimeout(() => {
                        dispatch(hideModal());
                    }, 3000);
                    setSelectItem(prevItems =>
                        prevItems.filter(
                            prevItem => prevItem.itemId !== itemId,
                        ),
                    );
                },
                onError: err => {
                    dispatch(
                        showModal({
                            status: 'failed',
                            text: 'cannot save input',
                        }),
                    );
                    setTimeout(() => {
                        dispatch(hideModal());
                    }, 2000);
                    handleAxiosError(err);
                },
            },
        );
    };

    const handleForm = (
        values: SelectInputRequest,
        actions: FormikHelpers<SelectInputRequest>,
    ) => {
        const payload = {
            label: selectChange,
            inputType: values.fieldType,
            required: values.required,
            unit: values.unit,
            templateName: templateType,
        };
        mutationAddDynamicInputDropDownItem.mutate(payload, {
            onSuccess: resp => {
                const itemId = resp.data.data;
                setselectCheck(false);
                values.fieldType = '';
                values.unit = '';
                setSelectChange('');
                actions.setSubmitting(false);
                dispatch(
                    showModal({
                        status: 'success',
                        text: 'Adding input success',
                    }),
                );

                setTimeout(() => {
                    dispatch(hideModal());
                }, 3000);
                setSelectItem(prevState => [
                    ...prevState,
                    { id: Date.now(), itemId, value: selectChange },
                ]);
            },
            onError: err => {
                dispatch(
                    showModal({
                        status: 'failed',
                        text: 'cannot save input',
                    }),
                );
                setTimeout(() => {
                    dispatch(hideModal());
                }, 2000);
                handleAxiosError(err);
                actions.setSubmitting(false);
            },
        });
    };

    return (
        <View>
            <View
                marginB-20
                style={{
                    borderWidth: 1,
                    borderRadius: 5,
                    borderColor: Color.primaryColor,
                }}>
                <View row>
                    <View style={{ width: '80%' }}>
                        <TextInput
                            leftIcon
                            placeholder={`Item`}
                            label={`Item`}
                            // onBlur={handleBlur('unit')}
                            onChange={value => setSelectChange(value)}
                            value={selectChange}
                            // error={touched.unit && errors.unit}
                        />
                        {selectCheck && selectChange === '' && (
                            <View>
                                <TextInputError
                                    errorText={'Field input wajib diisi'}
                                />
                            </View>
                        )}
                    </View>
                    {!selectCheck && (
                        <View style={{ justifyContent: 'center' }}>
                            <CustomButton
                                title="Add"
                                disable={selectChange == ''}
                                onSubmit={() => {
                                    setSelectChange('');
                                    setSelectItem([
                                        ...selectItem,
                                        {
                                            id: Date.now(),
                                            value: selectChange,
                                        },
                                    ]);
                                }}
                            />
                        </View>
                    )}
                </View>
                <View>
                    <CheckBox
                        checked={selectCheck}
                        checkedIcon={<CheckboxCheckedIcon />}
                        uncheckedIcon={<CheckboxIcon />}
                        onPress={() => {
                            setselectCheck(!selectCheck);
                        }}
                        wrapperStyle={{
                            gap: 12,
                        }}
                        title={'Add this option as input column '}
                        containerStyle={{
                            width: width / 1.4,
                            justifyContent: 'center',
                            alignItems: 'flex-start',
                            backgroundColor: Color.lightTextColor,
                            // marginTop: -,
                        }}
                    />
                </View>

                {selectCheck && (
                    <Formik
                        initialValues={formikInitialValues}
                        onSubmit={handleForm}
                        validationSchema={formValidationScheme}>
                        {({
                            handleBlur,
                            handleChange,
                            handleSubmit,
                            isSubmitting,
                            touched,
                            errors,
                            values,
                            setFieldValue,
                        }: FormikProps<SelectInputRequest>) => (
                            <>
                                <View paddingB-20 marginT-10>
                                    <View
                                        marginH-10
                                        marginB-5
                                        style={{
                                            height: openPicker
                                                ? 170
                                                : undefined,
                                        }}>
                                        <Text
                                            style={{
                                                fontFamily: FontFamily.medium,
                                                fontSize: FontSize.xl,
                                                color: Color.primaryColor,
                                                marginBottom: 10,
                                            }}>
                                            Select field type:
                                        </Text>
                                        <DropDownPicker
                                            style={{
                                                marginStart: -4,
                                                borderBottomWidth: 1,
                                                borderColor:
                                                    touched.fieldType &&
                                                    errors.fieldType
                                                        ? Color.errorColor
                                                        : Color.primaryColor,
                                                backgroundColor: Color.bgColor,
                                            }}
                                            placeholderStyle={{
                                                fontFamily: FontFamily.regular,
                                                fontSize: FontSize.md,
                                                color: Color.neutralColor,
                                            }}
                                            labelStyle={{
                                                fontFamily: FontFamily.regular,
                                                fontSize: FontSize.md,
                                                color: Color.darkTextColor,
                                            }}
                                            dropDownContainerStyle={{
                                                marginStart: -4,
                                                marginHorizontal: 10,
                                                borderWidth: 1.5,
                                                borderColor: Color.primaryColor,
                                                backgroundColor: Color.bgColor,
                                                elevation: 5,
                                            }}
                                            listItemLabelStyle={{
                                                fontFamily: FontFamily.regular,
                                                fontSize: FontSize.md,
                                                color: Color.darkTextColor,
                                            }}
                                            itemSeparatorStyle={{
                                                backgroundColor:
                                                    Color.neutralColor,
                                            }}
                                            onSelectItem={e =>
                                                setFieldValue(
                                                    'fieldType',
                                                    e.value,
                                                )
                                            }
                                            placeholder="Select Item"
                                            itemSeparator={true}
                                            open={openPicker}
                                            items={pickerItem}
                                            setOpen={setOpenPicker}
                                            value={selectFieldType}
                                            setValue={setSelectFieldType}
                                            mode="SIMPLE"
                                            listMode="SCROLLVIEW"
                                            dropDownDirection="BOTTOM"
                                        />
                                    </View>
                                    {touched.fieldType && errors.fieldType && (
                                        <View
                                            style={{
                                                paddingTop: 26,
                                            }}>
                                            <TextInputError
                                                errorText={errors.fieldType}
                                            />
                                        </View>
                                    )}
                                    {selectFieldType === 'numericInput' && (
                                        <View marginT-5>
                                            <TextInput
                                                leftIcon
                                                placeholder="Unit"
                                                label="Unit"
                                                onBlur={handleBlur('unit')}
                                                onChange={handleChange('unit')}
                                                error={
                                                    touched.unit && errors.unit
                                                }
                                                value={values.unit}
                                            />
                                            {touched.unit && errors.unit && (
                                                <TextInputError
                                                    errorText={errors.unit}
                                                />
                                            )}
                                        </View>
                                    )}
                                    <View paddingH-8 marginT-10>
                                        <CustomButton
                                            title="Add Input"
                                            isSubmitting={isSubmitting}
                                            onSubmit={() => handleSubmit()}
                                        />
                                    </View>
                                </View>
                            </>
                        )}
                    </Formik>
                )}
            </View>
            {selectItem.length > 0 && (
                <View paddingH-10>
                    <CustomText
                        fontFamily="regular"
                        fontSize="lg"
                        color="primaryColor">
                        Options
                    </CustomText>
                    {selectItem.map((item, index) => (
                        <View
                            key={index}
                            marginB-10
                            row
                            style={{
                                justifyContent: 'space-between',
                            }}>
                            <CustomText
                                fontFamily="regular"
                                fontSize="lg"
                                color="darkTextColor">
                                - {item.value}
                            </CustomText>
                            <Button
                                backgroundColor={Color.softSecBgPrimary}
                                padding-4
                                iconSource={() => <TrashIcon />}
                                onPress={() =>
                                    item.itemId
                                        ? handleDeleteInput(item.itemId)
                                        : handleDeleteItem(item.id)
                                }
                            />
                        </View>
                    ))}
                </View>
            )}
        </View>
    );
};

export default SelectInputProperties;
