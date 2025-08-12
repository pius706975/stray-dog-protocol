import React from 'react';
import { Text, View } from 'react-native-ui-lib';
import {
    AddRfqTemplateProps,
    AddRFQTemplateRequest,
} from '../../../../../types';
import {
    CustomText,
    ScreenLayout,
    TextInput,
    TextInputError,
} from '../../../../../components';
import { Formik, FormikHelpers, FormikProps } from 'formik';
import * as yup from 'yup';
import { Color, FontFamily, FontSize } from '../../../../../configs';
import CustomButton from '../../../../../components/Button';
import {
    useActiveDynamicInput,
    useAddRfqTemplate,
    useGetShipCategories,
} from '../../../../../hooks';
import { useDispatch } from 'react-redux';
import { modalSlice } from '../../../../../slices';
import DropDownPicker from 'react-native-dropdown-picker';
import { useIsFocused } from '@react-navigation/native';
import { handleAxiosError } from '../../../../../utils';

const AddRfqTemplate: React.FC<AddRfqTemplateProps> = ({ navigation }) => {
    const dispatch = useDispatch();
    const { hideModal, showModal } = modalSlice.actions;
    const [fieldType, setFieldType] = React.useState('');
    const [open, setOpen] = React.useState(false);
    const [items, setItems] = React.useState([
        {
            label: 'Default',
            value: 'default',
            testID: 'test-default',
        },
    ]);
    const mutationAddRfqTemplate = useAddRfqTemplate();
    const mutationgetShipCategories = useGetShipCategories();
    const isFocused = useIsFocused();

    React.useEffect(() => {
        if (isFocused) {
            mutationgetShipCategories.mutate(undefined, {
                onSuccess: resp => {
                    const shipCategories = resp.data.data;
                    shipCategories.map(item => {
                        setItems(prev => [
                            ...prev,
                            {
                                label: item.name,
                                value: item.name,
                                testID: `item-${item.name}`,
                            },
                        ]);
                    });
                },
                onError: err => {
                    handleAxiosError(err);
                },
            });
        }
    }, [isFocused]);

    const addRfqTemplateValues: AddRFQTemplateRequest = {
        shipType: '',
    };

    const addRfqTemplateSchema = yup.object().shape({
        shipType: yup.string().required('Ship Type is required'),
    });

    const handleAddRfqTemplate = (
        values: AddRFQTemplateRequest,
        actions: FormikHelpers<AddRFQTemplateRequest>,
    ) => {
        const payload = {
            templateType: `${values.shipType}Rfq`,
        };
        mutationAddRfqTemplate.mutate(payload, {
            onSuccess: () => {
                dispatch(
                    showModal({
                        status: 'success',
                        text: 'Add RFQ Template Success',
                    }),
                );

                setTimeout(() => {
                    dispatch(hideModal());
                }, 3000);
                actions.setSubmitting(false);
                navigation.navigate('RFQTemplateManagement');
            },
            onError: err => {
                dispatch(
                    showModal({
                        status: 'failed',
                        text: 'Add RFQ Template Failed/Duplicate Template',
                    }),
                );

                setTimeout(() => {
                    dispatch(hideModal());
                }, 3000);
                actions.setSubmitting(false);
            },
        });
    };
    return (
        <ScreenLayout
            backgroundColor="light"
            testId="AddRfqTemplate"
            gap={10}
            padding={10}>
            <View style={{ marginVertical: 8, alignItems: 'center' }}>
                <CustomText
                    fontSize="sm"
                    fontFamily="semiBold"
                    color="darkTextColor">
                    Please enter the ship type for the new RFQ template
                </CustomText>
            </View>
            <Formik
                initialValues={addRfqTemplateValues}
                onSubmit={handleAddRfqTemplate}
                validationSchema={addRfqTemplateSchema}>
                {({
                    handleBlur,
                    handleChange,
                    handleSubmit,
                    values,
                    touched,
                    errors,
                    isSubmitting,
                    setFieldValue,
                }: FormikProps<AddRFQTemplateRequest>) => (
                    <>
                        <View style={{ paddingLeft: 10 }}>
                            <Text
                                style={{
                                    fontFamily: FontFamily.medium,
                                    fontSize: FontSize.xl,
                                    color: Color.primaryColor,
                                    marginBottom: 10,
                                }}>
                                Select Template Type:
                            </Text>
                            <DropDownPicker
                                testID="template-picker"
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
                                    setFieldValue('shipType', e.value)
                                }
                            />
                        </View>
                        <View
                            flexG-1
                            marginB-30
                            style={{ justifyContent: 'flex-end' }}>
                            <CustomButton
                                testID="submit-btn"
                                title="Add New RFQ Template"
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

export default AddRfqTemplate;
