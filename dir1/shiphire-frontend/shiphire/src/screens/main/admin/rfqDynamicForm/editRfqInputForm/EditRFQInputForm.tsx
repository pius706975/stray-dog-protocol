import React from 'react';
import { View, Text } from 'react-native-ui-lib';
import * as yup from 'yup';
import {
    DynamicInputRFQData,
    DynamicInputRFQResponse,
    EditRFQInputFormProps,
    RFQInputFormRequest,
} from '../../../../../types';
import {
    useEditRFQDynamicInputItem,
    useGetDynamicInputRFQById,
} from '../../../../../hooks';
import { Pressable, SafeAreaView, useWindowDimensions } from 'react-native';
import {
    CustomText,
    ScreenLayout,
    TextInput,
    TextInputError,
} from '../../../../../components';
import { Formik, FormikHelpers, FormikProps } from 'formik';
import { CheckBox } from '@rneui/base';
import {
    CheckboxCheckedIcon,
    CheckboxIcon,
    Color,
    FontFamily,
    FontSize,
} from '../../../../../configs';
import { InputPreview } from '../rfqInputForm/components';
import DropDownPicker from 'react-native-dropdown-picker';
import { useDispatch } from 'react-redux';
import { modalSlice } from '../../../../../slices';
import CustomButton from '../../../../../components/Button';
import { handleAxiosError } from '../../../../../utils';
import { SelectInputProperties, AdditionalInput } from './components';

type RadioProps = {
    id: number;
    value: string;
};
type SelectProps = {
    id: number;
    itemId?: string;
    value: string;
};

const EditRFQInputForm: React.FC<EditRFQInputFormProps> = ({
    navigation,
    route,
}) => {
    const { _id, templateType, formType } = route.params;
    const [dynamicInputData, setDynamicInputData] =
        React.useState<DynamicInputRFQResponse>();
    const mutationGetDynamicInputRFQById = useGetDynamicInputRFQById();
    const mutationEditRFQDynamicInput = useEditRFQDynamicInputItem();
    const [initialRequireCheck, setInitialRequireCheck] = React.useState(false);
    const { width } = useWindowDimensions();
    const [fieldType, setFieldType] = React.useState('');
    const [multilineCheck, setMultilineCheck] = React.useState(false);
    const [open, setOpen] = React.useState(false);
    const [radioItem, setRadioItem] = React.useState<RadioProps[]>([]);
    const [selectItem, setSelectItem] = React.useState<SelectProps[]>([]);
    const dispatch = useDispatch();
    const { hideModal, showModal } = modalSlice.actions;
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
        // {
        //     label: 'Select Drop Down',
        //     value: 'selectDropDown',
        // },
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
        mutationGetDynamicInputRFQById.mutate(_id, {
            onSuccess: resp => {
                console.log('resp.data.data', resp.data.data);
                setDynamicInputData(resp.data.data);
                setInitialRequireCheck(resp.data.data.required);
                setFieldType(resp.data.data.dynamicInput.inputType);
                setMultilineCheck(
                    resp.data.data.validation?.multiline ?? false,
                );
                setRadioItem(
                    (resp.data.data.option || []).map((item, index) => ({
                        id: index,
                        value: item.value,
                    })),
                );

                console.log(resp.data.data.validation?.multiline ?? false);
            },
            onError: err => {
                console.log(err);
            },
        });
    }, [_id]);

    const editDynamicInputRFQValues: RFQInputFormRequest = {
        label: dynamicInputData?.dynamicInput.label || '',
        inputType: dynamicInputData?.dynamicInput.inputType,
        required: initialRequireCheck,
        order: 0,
        unit: dynamicInputData?.dynamicInput.unit,
        min: String(dynamicInputData?.validation?.min || ''),
        multiline: dynamicInputData?.validation?.multiline || false,
    };

    const editDynamicInputFormValidationScheme = yup.object().shape({
        label: yup.string().required('Label is required.'),
        inputType: yup.string().required('Field type is required.'),
        required: yup.boolean(),
        unit: yup.string(),
        order: yup.number(),
        min: yup.string(),
        multiline: yup.boolean(),
        templateType: yup.string(),
        formType: yup.string(),
        option: yup.array(),
        // Add validation for other fields as needed
    });

    // const handleMultilineChange = (newMultilineCheck: boolean) => {
    //     // Do something with the updated multiline state
    //     console.log('Multiline state changed:', newMultilineCheck);

    //     // Update the multiline state
    //     setMultilineCheck(newMultilineCheck);
    // };

    const handleEditDynamicInputRFQ = (
        values: RFQInputFormRequest,
        actions: FormikHelpers<RFQInputFormRequest>,
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
            // } else if (values.inputType === 'selectDropDown') {
            //     optionArr = selectItem.map(item => ({
            //         value: item.value,
            //     }));
            //     if (optionArr.length === 0) {
            //         dispatch(
            //             showModal({
            //                 status: 'failed',
            //                 text: 'Add at least 1 item',
            //             }),
            //         );
            //         setTimeout(() => {
            //             dispatch(hideModal());
            //         }, 2000);
            //         actions.setSubmitting(false);
            //         return;
            //     }
        }
        // console.log('values', values);
        const payload = {
            id: _id,
            formType: formType,
            templateType: templateType,
            label: values.label,
            inputType: values.inputType,
            required: values.required,
            min: values.min === '' ? undefined : Number(values.min),
            multiline:
                values.inputType !== 'textInput' ? undefined : multilineCheck,
            option: optionArr,
        };
        mutationEditRFQDynamicInput.mutate(payload, {
            onSuccess: () => {
                dispatch(
                    showModal({
                        status: 'success',
                        text: 'Edit Input Success',
                    }),
                );

                setTimeout(() => {
                    dispatch(hideModal());
                }, 3000);
                actions.setSubmitting(false);
                navigation.navigate('RFQFormInputManagement', {
                    templateType,
                    formType,
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
                            text: 'Cannot Edit Input',
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
            backgroundColor="light"
            testId="editDynamicInputRFQForm"
            gap={10}
            padding={10}>
            <View style={{ marginVertical: 8, alignItems: 'center' }}>
                <CustomText
                    fontSize="sm"
                    fontFamily="semiBold"
                    color="darkTextColor">
                    Please fill the form below to edit dynamic input for RFQ
                    Form
                </CustomText>
            </View>
            <Formik
                enableReinitialize={true}
                initialValues={editDynamicInputRFQValues}
                onSubmit={handleEditDynamicInputRFQ}
                validationSchema={editDynamicInputFormValidationScheme}>
                {({
                    handleBlur,
                    handleChange,
                    handleSubmit,
                    isSubmitting,
                    setFieldValue,
                    touched,
                    errors,
                    values,
                }: FormikProps<RFQInputFormRequest>) => (
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
                                checked={values.required ?? false}
                                checkedIcon={<CheckboxCheckedIcon />}
                                uncheckedIcon={<CheckboxIcon />}
                                onPress={() => {
                                    setFieldValue('required', !values.required);
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
                            multilineCheck={multilineCheck}
                            onMultilineChange={setMultilineCheck}
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
                                title="Edit Dynamic Input"
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

export default EditRFQInputForm;
