import React from 'react';
import { Text, View } from 'react-native-ui-lib';
import {
    AddShipDynamicInputRequest,
    AddShipInputEditFormProps,
} from '../../../../../types';
import { useWindowDimensions } from 'react-native';
import { useDispatch } from 'react-redux';
import { modalSlice } from '../../../../../slices';
import {
    useAddDynamicInputItem,
    useGetSelectDropDownInput,
    useUpdateDynamicInputAddShip,
} from '../../../../../hooks';
import * as yup from 'yup';
import {
    ScreenLayout,
    TextInput,
    TextInputError,
} from '../../../../../components';
import { Formik, FormikProps, FormikHelpers } from 'formik';
import { CheckBox } from '@rneui/base';
import {
    CheckboxCheckedIcon,
    CheckboxIcon,
    Color,
    FontFamily,
    FontSize,
} from '../../../../../configs';

import DropDownPicker from 'react-native-dropdown-picker';
import CustomButton from '../../../../../components/Button';
import { AdditionalInput, SelectInputProperties } from './components';
import { InputPreview } from '../addShipInputForm/components';
import { handleAxiosError } from '../../../../../utils';
import { useIsFocused } from '@react-navigation/native';

type RadioProps = {
    _id: string;
    value: string;
};
type SelectProps = {
    id: number;
    itemId?: string;
    value: string;
};

const AddShipInputEditForm: React.FC<AddShipInputEditFormProps> = ({
    navigation,
    route,
}) => {
    const { inputData } = route.params;
    const { width } = useWindowDimensions();
    const [fieldType, setFieldType] = React.useState(inputData.inputType);
    const [open, setOpen] = React.useState(false);
    const [requireCheck, setRequireCheck] = React.useState(inputData.required);
    const [radioItem, setRadioItem] = React.useState<RadioProps[]>(
        inputData?.option || [],
    );
    const dispatch = useDispatch();
    const { hideModal, showModal } = modalSlice.actions;
    const [selectItem, setSelectItem] = React.useState<SelectProps[]>([]);
    const mutationGetSelectDropDownInput = useGetSelectDropDownInput();
    const mutationUpdateDynamicInputAddShip = useUpdateDynamicInputAddShip();
    const isFocused = useIsFocused();

    const [items, setItems] = React.useState([
        {
            label: 'Text Input',
            value: 'textInput',
        },
        {
            label: 'Numeric Input',
            value: 'numericInput',
        },
        {
            label: 'Date Picker',
            value: 'datePicker',
        },
        {
            label: 'Radio Drop Down',
            value: 'radioDropdown',
        },
        {
            label: 'Select Drop Down',
            value: 'selectDropDown',
        },
        {
            label: 'Document Select',
            value: 'docSelect',
        },
        {
            label: 'Image Select',
            value: 'imageSelect',
        },
        {
            label: 'Date Picker Calendar',
            value: 'datePickerCalendar',
        },
    ]);

    React.useEffect(() => {
        if (isFocused) {
            if (inputData.inputType === 'selectDropDown') {
                const payload = {
                    templateType: inputData.templateType,
                };
                mutationGetSelectDropDownInput.mutate(payload, {
                    onSuccess: resp => {
                        const dropdownData = resp.data.data;
                        const combinedData = inputData.option?.map(
                            (item, index) => {
                                const response = dropdownData.find(
                                    item2 => item2.label === item.value,
                                );
                                return {
                                    id: index + 1,
                                    value: item.value,
                                    itemId: response ? response._id : undefined,
                                };
                            },
                        );
                        if (combinedData) {
                            setSelectItem(combinedData);
                        }
                    },
                    onError: err => {
                        handleAxiosError(err);
                    },
                });
            }
        }
    }, [isFocused]);

    const formValidationScheme: yup.ObjectSchema<
        AddShipDynamicInputRequest & { required?: boolean; multiline?: boolean }
    > = yup.object().shape({
        label: yup.string().required('label is required.'),
        inputType: yup.string().required('Field type is required.'),
        required: yup.boolean(),
        unit: yup.string().when('inputType', {
            is: 'numericInput',
            then: schema => schema.required('unit is required'),
        }),
        order: yup.number(),
        templateName: yup.string(),
        min: yup.string(),
        max: yup.string(),
        multiline: yup.boolean(),
        isTemplateNameDisplayed: yup.boolean(),
        option: yup.array(),
        expired: yup.boolean(),
    });

    const formikInitialValues: AddShipDynamicInputRequest = {
        label: inputData.label,
        inputType: inputData.inputType,
        required: inputData.required,
        unit: inputData.unit,
        min:
            inputData.validate?.min === undefined
                ? ''
                : `${inputData.validate?.min}`,
        max:
            inputData.validate?.max === undefined
                ? ''
                : `${inputData.validate?.max}`,
        multiline: inputData?.validate?.multiline || false,
        expired: inputData?.expired,
    };

    const handleFormSubmit = (
        values: AddShipDynamicInputRequest,
        actions: FormikHelpers<AddShipDynamicInputRequest>,
    ) => {
        let optionArr: { value: string }[] = [];
        if (values.inputType === 'radioDropdown') {
            optionArr = radioItem.map(item => ({
                value: item.value,
            }));
            if (optionArr.length === 0) {
                dispatch(
                    showModal({
                        status: 'failed',
                        text: 'Add at least 1 item',
                    }),
                );
                setTimeout(() => {
                    dispatch(hideModal());
                }, 2000);
                actions.setSubmitting(false);
                return;
            }
        } else if (values.inputType === 'selectDropDown') {
            optionArr = selectItem.map(item => ({
                value: item.value,
            }));
            if (optionArr.length === 0) {
                dispatch(
                    showModal({
                        status: 'failed',
                        text: 'Add at least 1 item',
                    }),
                );
                setTimeout(() => {
                    dispatch(hideModal());
                }, 2000);
                actions.setSubmitting(false);
                return;
            }
        }
        const payload = {
            label: values.label,
            inputType: values.inputType,
            required: values.required,
            unit: values.unit === '' ? undefined : values.unit,
            templateName: inputData.templateType,
            min: values.min === '' ? undefined : values.min,
            max: values.max === '' ? undefined : values.max,
            multiline:
                values.inputType !== 'textInput' ? undefined : values.multiline,
            option: optionArr,
            id: inputData._id,
            expired: values.expired,
        };

        mutationUpdateDynamicInputAddShip.mutate(payload, {
            onSuccess: () => {
                dispatch(
                    showModal({
                        status: 'success',
                        text: 'Update Input Success',
                    }),
                );
                setTimeout(() => {
                    dispatch(hideModal());
                }, 3000);
                actions.setSubmitting(false);
                navigation.pop();
                navigation.navigate('AddShipInputManagement', {
                    templateType: inputData.templateType,
                });
            },
            onError: err => {
                if (err.response?.status === 400) {
                    dispatch(
                        showModal({
                            status: 'failed',
                            text: 'Label already exists',
                        }),
                    );
                    setTimeout(() => {
                        dispatch(hideModal());
                    }, 2000);
                } else {
                    dispatch(
                        showModal({
                            status: 'failed',
                            text: 'Cannot Update Input',
                        }),
                    );
                    setTimeout(() => {
                        dispatch(hideModal());
                    }, 2000);
                }
                handleAxiosError(err);
                actions.setSubmitting(false);
            },
        });
    };

    return (
        <ScreenLayout
            testId="AddShipInputForm"
            backgroundColor="light"
            padding={10}
            gap={10}>
            <Formik
                initialValues={formikInitialValues}
                onSubmit={handleFormSubmit}
                validationSchema={formValidationScheme}>
                {({
                    handleBlur,
                    handleChange,
                    handleSubmit,
                    isSubmitting,
                    setFieldValue,
                    touched,
                    errors,
                    values,
                }: FormikProps<AddShipDynamicInputRequest>) => (
                    <>
                        <View marginT-10>
                            <TextInput
                                leftIcon
                                placeholder="Label"
                                label="Label"
                                onBlur={handleBlur('label')}
                                onChange={handleChange('label')}
                                error={touched.label && errors.label}
                                value={values.label}
                            />
                            {touched.label && errors.label && (
                                <TextInputError errorText={errors.label} />
                            )}
                        </View>
                        <View>
                            <CheckBox
                                testID="cb-required"
                                checked={requireCheck}
                                checkedIcon={<CheckboxCheckedIcon />}
                                uncheckedIcon={<CheckboxIcon />}
                                onPress={() => {
                                    setFieldValue('required', !requireCheck);
                                    setRequireCheck(!requireCheck);
                                }}
                                wrapperStyle={{
                                    gap: 12,
                                }}
                                title={'Required for this input'}
                                containerStyle={{
                                    width: width / 1.4,
                                    justifyContent: 'center',
                                    alignItems: 'flex-start',
                                    backgroundColor: Color.bgColor,
                                    marginTop: -18,
                                }}
                            />
                        </View>
                        <InputPreview fieldType={fieldType} />

                        <View style={{ paddingLeft: 10 }}>
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
                                open={open}
                                value={fieldType}
                                items={items}
                                setOpen={setOpen}
                                setValue={setFieldType}
                                setItems={setItems}
                                mode="SIMPLE"
                                listMode="MODAL"
                                searchable={false}
                                modalTitle="Select an item"
                                modalProps={{
                                    animationType: 'slide',
                                }}
                                style={{
                                    backgroundColor: Color.bgColor,
                                    borderColor: Color.bgNeutralColor,
                                    elevation: 2,
                                }}
                                placeholderStyle={{
                                    color: Color.primaryColor,
                                    fontFamily: FontFamily.regular,
                                }}
                                modalContentContainerStyle={{
                                    backgroundColor: Color.bgColor,
                                }}
                                modalTitleStyle={{
                                    fontFamily: FontFamily.regular,
                                }}
                                labelStyle={{
                                    color: Color.primaryColor,
                                    fontFamily: FontFamily.regular,
                                }}
                                listItemContainerStyle={{
                                    borderBottomWidth: 1,
                                    marginVertical: 5,
                                    borderColor: Color.bgNeutralColor,
                                    // elevation: 1,
                                }}
                                listItemLabelStyle={{
                                    color: Color.primaryColor,
                                    fontFamily: FontFamily.regular,
                                }}
                                selectedItemContainerStyle={{
                                    backgroundColor: Color.secColor,
                                }}
                                selectedItemLabelStyle={{
                                    fontFamily: FontFamily.bold,
                                    color: Color.bgColor,
                                }}
                                onSelectItem={e =>
                                    setFieldValue('inputType', e.value)
                                }
                            />
                        </View>
                        <AdditionalInput
                            fieldType={fieldType}
                            setFieldValue={setFieldValue}
                            handleBlur={handleBlur}
                            handleChange={handleChange}
                            touched={touched}
                            errors={errors}
                            values={values}
                            radioItem={radioItem}
                            setRadioItem={setRadioItem}
                        />
                        {fieldType === 'selectDropDown' && (
                            <SelectInputProperties
                                selectItem={selectItem}
                                setSelectItem={setSelectItem}
                                templateType={inputData.templateType}
                            />
                        )}
                        <View
                            flexG-1
                            marginB-30
                            style={{ justifyContent: 'flex-end' }}>
                            <CustomButton
                                testID="add-button"
                                title="Update Dynamic Input"
                                isSubmitting={isSubmitting}
                                onSubmit={() => handleSubmit()}
                            />
                        </View>
                    </>
                )}
            </Formik>
        </ScreenLayout>
    );
};

export default AddShipInputEditForm;
