import React from 'react';
import { Text, View } from 'react-native-ui-lib';
import {
    DynamicFormRFQ,
    RFQInputFormOwnerDetailProps,
    RFQInputFormRequest,
} from '../../../../../types';
import {
    CustomText,
    ScreenLayout,
    TextInput,
    TextInputError,
} from '../../../../../components';
import { Formik, FormikProps, FormikHelpers } from 'formik';
import * as yup from 'yup';
import {
    CheckboxCheckedIcon,
    CheckboxIcon,
    Color,
    FontFamily,
    FontSize,
} from '../../../../../configs';
import DropDownPicker from 'react-native-dropdown-picker';
import { useWindowDimensions } from 'react-native';
import { CheckBox } from '@rneui/base';

import {
    AdditionalInput,
    InputPreview,
    SelectInputProperties,
} from './components';
import CustomButton from '../../../../../components/Button';
import { useDispatch } from 'react-redux';
import { modalSlice } from '../../../../../slices';
import { handleAxiosError } from '../../../../../utils';
import { useAddDynamicInputItemOwner } from '../../../../../hooks';
import { useTranslation } from 'react-i18next';
type RadioProps = {
    id: number;
    value: string;
};
type SelectProps = {
    id: number;
    itemId?: string;
    value: string;
};

const RFQInputFormOwnerDetail: React.FC<RFQInputFormOwnerDetailProps> = ({
    navigation,
    route,
}) => {
    const { templateType, formType, shipId } = route.params;
    const { width } = useWindowDimensions();
    const { t } = useTranslation('rfq');
    const [fieldType, setFieldType] = React.useState('');
    const [open, setOpen] = React.useState(false);
    const [requireCheck, setRequireCheck] = React.useState(false);
    const [multilineCheck, setMultilineCheck] = React.useState<boolean>(false);
    const [radioItem, setRadioItem] = React.useState<RadioProps[]>([]);
    const dispatch = useDispatch();
    const { hideModal, showModal } = modalSlice.actions;
    const [selectItem, setSelectItem] = React.useState<SelectProps[]>([]);
    const mutationAddRFQDynamicInputItem = useAddDynamicInputItemOwner();
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
        // {
        //     label: 'Select Drop Down',
        //     value: 'selectDropDown',
        // },
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

    const addDefaultRFQFormValues: RFQInputFormRequest = {
        label: '',
        inputType: '',
        required: false,
        order: 0,
        unit: '',
        min: '',
        multiline: false,
    };

    const addDefaultRFQFormValidationScheme: yup.ObjectSchema<
        RFQInputFormRequest & { required?: boolean; multiline?: boolean }
    > = yup.object().shape({
        label: yup.string().required(t('RFQFormInputView.textRequired')),
        inputType: yup
            .string()
            .required(t('RFQFormInputView.textFieldTypeRequired')),
        required: yup.boolean(),
        unit: yup.string(),
        order: yup.number(),
        min: yup.string(),
        multiline: yup.boolean(),
        templateType: yup.string(),
        formType: yup.string(),
        option: yup.array(),
    });

    const handleAddDefaultRFQForm = (
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
                        text: t('RFQFormInputView.failedText'),
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
            //                 text: t('RFQFormInputView.failedText'),
            //             }),
            //         );
            //         setTimeout(() => {
            //             dispatch(hideModal());
            //         }, 2000);
            //         actions.setSubmitting(false);
            //         return;
            //     }
        }
        const payload = {
            label: values.label,
            inputType: values.inputType,
            required: requireCheck,
            unit: values.unit === '' ? undefined : values.unit,
            templateType: `${shipId}CustomRfq`,
            formType: 'rfqForm',
            min: values.min === '' ? undefined : values.min,
            multiline: false,
            option: optionArr,
        };

        mutationAddRFQDynamicInputItem.mutate(payload, {
            onSuccess: () => {
                dispatch(
                    showModal({
                        status: 'success',
                        text: t('RFQFormInputView.successTextAdd'),
                    }),
                );

                setTimeout(() => {
                    dispatch(hideModal());
                }, 3000);
                actions.setSubmitting(false);
                navigation.goBack();
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
            backgroundColor="light"
            testId="addDefaultRFQForm"
            gap={10}
            padding={10}>
            <View style={{ marginVertical: 8, alignItems: 'center' }}>
                <CustomText
                    fontSize="sm"
                    fontFamily="semiBold"
                    color="darkTextColor">
                    {t('RFQFormInputView.textFilltheForm')}
                </CustomText>
            </View>
            <Formik
                initialValues={addDefaultRFQFormValues}
                onSubmit={handleAddDefaultRFQForm}
                validationSchema={addDefaultRFQFormValidationScheme}>
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
                                testID="check-required"
                                checked={requireCheck}
                                checkedIcon={<CheckboxCheckedIcon />}
                                uncheckedIcon={<CheckboxIcon />}
                                onPress={() => {
                                    setRequireCheck(!requireCheck);
                                    setFieldValue('required', requireCheck);
                                }}
                                wrapperStyle={{
                                    gap: 12,
                                }}
                                title={t('RFQFormInputView.titleRequired')}
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
                                {t('RFQFormInputView.textSelectField')}
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
                                modalTitle={t(
                                    'RFQFormInputView.modalTitleDropDown',
                                )}
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
                                templateType={``}
                            />
                        )}
                        <View
                            flexG-1
                            marginB-30
                            style={{ justifyContent: 'flex-end' }}>
                            <CustomButton
                                testID="add-button"
                                title={t(
                                    'RFQFormInputView.textButtonAddDynamic',
                                )}
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

export default RFQInputFormOwnerDetail;
