import { Text, View } from 'react-native-ui-lib';
import {
    AddShipDynamicInputRequest,
    AddShipInputFormProps,
} from '../../../../../types';
import {
    CustomText,
    ScreenLayout,
    TextInput,
    TextInputError,
} from '../../../../../components';
import { Formik, FormikHelpers, FormikProps } from 'formik';
import * as yup from 'yup';
import {
    CheckboxCheckedIcon,
    CheckboxIcon,
    Color,
    FontFamily,
    FontSize,
} from '../../../../../configs';
import { CheckBox } from '@rneui/base';
import { useWindowDimensions } from 'react-native';
import React from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import {
    AdditionalInput,
    InputPreview,
    SelectInputProperties,
} from './components';
import CustomButton from '../../../../../components/Button';
import { useDispatch } from 'react-redux';
import { modalSlice } from '../../../../../slices';
import { useAddDynamicInputItem } from '../../../../../hooks';
import { handleAxiosError } from '../../../../../utils';
type RadioProps = {
    id: number;
    value: string;
};
type SelectProps = {
    id: number;
    itemId?: string;
    value: string;
};

const AddShipInputForm: React.FC<AddShipInputFormProps> = ({
    navigation,
    route,
}) => {
    const { templateType } = route.params;
    const { width } = useWindowDimensions();
    const [fieldType, setFieldType] = React.useState('');
    const [open, setOpen] = React.useState(false);
    const [requireCheck, setRequireCheck] = React.useState(false);
    const [radioItem, setRadioItem] = React.useState<RadioProps[]>([]);
    const dispatch = useDispatch();
    const { hideModal, showModal } = modalSlice.actions;
    const [selectItem, setSelectItem] = React.useState<SelectProps[]>([]);
    const mutationAddDynamicInputItem = useAddDynamicInputItem();
    const [items, setItems] = React.useState([
        {
            label: 'Text Input',
            value: 'textInput',
            testID: 'text-input-item',
        },
        {
            label: 'Numeric Input',
            value: 'numericInput',
            testID: 'numeric-input-item',
        },
        {
            label: 'Date Picker',
            value: 'datePicker',
            testID: 'date-picker-item',
        },
        {
            label: 'Radio Drop Down',
            value: 'radioDropdown',
            testID: 'radio-dropdown-item',
        },
        {
            label: 'Select Drop Down',
            value: 'selectDropDown',
            testID: 'select-dropdown-item',
        },
        {
            label: 'Document Select',
            value: 'docSelect',
            testID: 'document-select-item',
        },
        {
            label: 'Image Select',
            value: 'imageSelect',
            testID: 'image-select-item',
        },
        {
            label: 'Date Picker Calendar',
            value: 'datePickerCalendar',
            testID: 'datepicker-calendar-item',
        },
    ]);

    const formValidationScheme: yup.ObjectSchema<
        AddShipDynamicInputRequest & {
            required?: boolean;
            multiline?: boolean;
            isTemplateNameDisplayed?: boolean;
            expired?: boolean;
        }
    > = yup.object().shape({
        isTemplateNameDisplayed: yup.boolean(),
        label: yup.string().required('label is required.'),
        inputType: yup.string().required('Field type is required.'),
        required: yup.boolean(),
        unit: yup.string().when('inputType', {
            is: 'numericInput',
            then: schema => schema.required('Unit is required'),
        }),
        order: yup.number(),
        min: yup.string(),
        max: yup.string(),
        multiline: yup.boolean(),
        templateName: yup.string().when('isTemplateNameDisplayed', {
            is: true,
            then: schema => schema.required('Template type is required'),
        }),
        option: yup.array(),
        expired: yup.boolean(),
    });
    const formikInitialValues: AddShipDynamicInputRequest = {
        label: '',
        inputType: '',
        required: false,
        order: 0,
        unit: '',
        min: '',
        max: '',
        expired: undefined,
        multiline: false,
        templateName: `${templateType}`,
        isTemplateNameDisplayed: templateType === '' ? true : false,
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
            templateName:
                templateType === '' ? values.templateName : `${templateType}`,
            min: values.min === '' ? undefined : values.min,
            max: values.max === '' ? undefined : values.max,
            multiline:
                values.inputType !== 'textInput' ? undefined : values.multiline,
            option: optionArr,
            expired: values.expired,
        };

        mutationAddDynamicInputItem.mutate(payload, {
            onSuccess: resp => {
                const response = resp.data.data;

                dispatch(
                    showModal({
                        status: 'success',
                        text: 'Add Input Success',
                    }),
                );

                setTimeout(() => {
                    dispatch(hideModal());
                }, 3000);
                actions.setSubmitting(false);
                navigation.pop();
                navigation.navigate('AddShipInputManagement', {
                    templateType: response.templateType,
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
                            text: 'Cannot Save Input',
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
                        {templateType === '' && (
                            <View marginT-10>
                                <View row>
                                    <View style={{ width: '75%' }}>
                                        <TextInput
                                            leftIcon
                                            placeholder="Template Type"
                                            label="Template Type"
                                            onBlur={handleBlur('templateName')}
                                            onChange={handleChange(
                                                'templateName',
                                            )}
                                            error={
                                                touched.templateName &&
                                                errors.templateName
                                            }
                                            value={values.templateName}
                                        />
                                        {touched.templateName &&
                                            errors.templateName && (
                                                <TextInputError
                                                    errorText={
                                                        errors.templateName
                                                    }
                                                />
                                            )}
                                    </View>
                                    <View style={{ alignSelf: 'center' }}>
                                        <CustomText
                                            fontFamily="regular"
                                            fontSize="md"
                                            color="darkTextColor">
                                            Spesific
                                        </CustomText>
                                    </View>
                                </View>
                            </View>
                        )}
                        <View>
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
                                testID="check-required"
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
                                testID="field-type"
                                open={open}
                                value={fieldType}
                                items={items}
                                setOpen={setOpen}
                                onPress={setOpen}
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
                                templateType={templateType}
                            />
                        )}
                        <View
                            flexG-1
                            marginB-30
                            style={{ justifyContent: 'flex-end' }}>
                            <CustomButton
                                testID="add-button"
                                title="Add Dynamic Input"
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

export default AddShipInputForm;
