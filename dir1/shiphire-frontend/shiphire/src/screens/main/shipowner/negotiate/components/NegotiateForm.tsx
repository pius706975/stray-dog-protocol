import React from 'react';
import {
    NegotiateFormOwnerProps,
    NegotiateFormProps,
} from '../../../../../types';
import { Text, View } from 'react-native-ui-lib';
import {
    CloseIcon,
    Color,
    FontFamily,
    FontSize,
    PlusIcon,
    RentIcon,
} from '../../../../../configs';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { Formik, FormikHelpers, FormikProps } from 'formik';
import {
    Button,
    CustomText,
    TextInput,
    TextInputError,
} from '../../../../../components';
import { useSendNegotiateContractOwner } from '../../../../../hooks';
import { useDispatch } from 'react-redux';
import { modalSlice, progressIndicatorSlice } from '../../../../../slices';
import { handleAxiosError } from '../../../../../utils';
import mime from 'mime';
import DocumentPicker, {
    DocumentPickerResponse,
} from 'react-native-document-picker';
import { TouchableOpacity } from 'react-native-gesture-handler';
import NumericInput from 'react-native-numeric-input';

const NegotiateForm: React.FC<NegotiateFormOwnerProps> = ({
    navigation,
    rentalId,
    renterId,
    shipId,
    offeredPrice,
}) => {
    const mutationSendRespondNegotiateContract =
        useSendNegotiateContractOwner();
    const { hideProgressIndicator, showProgressIndicator } =
        progressIndicatorSlice.actions;
    const [selectedPdf, setSelectedPdf] =
        React.useState<DocumentPickerResponse | null>(null);
    const [showDeleteButton, setShowDeleteButton] = React.useState(false);
    const dispatch = useDispatch();
    const { hideModal, showModal } = modalSlice.actions;
    const formData = new FormData();
    const [errorDocument, setErrorDocument] = React.useState<Boolean>(false);
    const [price, setPrice] = React.useState<number | undefined>(offeredPrice);
    const { t } = useTranslation('common');

    const formValidationScheme: yup.ObjectSchema<{
        notes: string;
    }> = yup.object().shape({
        notes: yup
            .string()
            .required(t('FormNegotiateOwner.NegotiateForm.validateNote')),
    });
    const formInitialValues: {
        notes: string;
    } = {
        notes: '',
    };
    const handleForm = async (
        values: { notes: string },
        actions: FormikHelpers<{
            notes: string;
        }>,
    ) => {
        if (selectedPdf !== null) {
            actions.setSubmitting(true);
            dispatch(showProgressIndicator());
            formData.append('document', {
                uri: selectedPdf?.uri,
                type: mime.getType(selectedPdf?.name),
                name: `Draft Contract`,
            });
            formData.append('note', values.notes);
            formData.append('rentalId', rentalId);
            formData.append('renterId', renterId);
            formData.append('shipId', shipId);
            formData.append('offeredPrice', price);

            mutationSendRespondNegotiateContract.mutate(formData, {
                onSuccess: () => {
                    dispatch(
                        showModal({
                            status: 'success',
                            text: t(
                                'FormNegotiateOwner.NegotiateForm.textSuccessForm',
                            ),
                        }),
                    );
                    setTimeout(() => {
                        navigation.reset({
                            index: 0,
                            routes: [
                                {
                                    name: 'ShipOwnerHome',
                                },
                            ],
                        });
                        dispatch(hideModal());
                        dispatch(hideProgressIndicator());
                    }, 3000);
                    actions.setSubmitting(false);
                },
                onError: err => {
                    dispatch(
                        showModal({
                            status: 'failed',
                            text: t(
                                'FormNegotiateOwner.NegotiateForm.textErrorForm',
                            ),
                        }),
                    );
                    setTimeout(() => {
                        dispatch(hideModal());
                        dispatch(hideProgressIndicator());
                    }, 2000);

                    handleAxiosError(err);
                    actions.setSubmitting(false);
                },
            });
        } else {
            setErrorDocument(true);
        }
    };

    const openPdfPicker = () => {
        DocumentPicker.pick({
            type: [DocumentPicker.types.pdf],
        })
            .then(result => {
                setSelectedPdf(result[0]);
                setShowDeleteButton(true);
            })
            .catch(error => {
                console.log(
                    t('FormNegotiateOwner.NegotiateForm.errorSelectingPdf'),
                    error,
                );
            });
    };

    return (
        <View
            style={{
                backgroundColor: Color.bgNeutralColor,
                borderRadius: 6,
                padding: 16,
            }}>
            <View
                row
                style={{
                    borderBottomWidth: 0.4,
                    paddingBottom: 16,
                    gap: 16,
                    alignItems: 'center',
                }}>
                <RentIcon />
                <Text
                    style={{
                        fontSize: FontSize.xl,
                        fontFamily: FontFamily.bold,
                        color: Color.primaryColor,
                    }}>
                    {t('FormNegotiateOwner.NegotiateForm.textHeaderNegotiate')}
                </Text>
            </View>

            <View marginT-10>
                <Text
                    style={{
                        fontSize: FontSize.sm,
                        fontFamily: FontFamily.regular,
                        color: Color.darkTextColor,
                    }}>
                    {t(
                        'FormNegotiateOwner.NegotiateForm.textNegotiateReplyDesc',
                    )}{' '}
                </Text>
            </View>
            <Formik
                initialValues={formInitialValues}
                onSubmit={handleForm}
                validationSchema={formValidationScheme}>
                {({
                    handleBlur,
                    handleChange,
                    isSubmitting,
                    handleSubmit,
                    setFieldValue,
                    touched,
                    errors,
                    values,
                }: FormikProps<{
                    notes: string;
                }>) => (
                    <>
                        <View
                            style={{
                                marginTop: 6,
                            }}>
                            <CustomText
                                color="primaryColor"
                                fontSize="xl"
                                fontFamily="medium">
                                {t(
                                    'FormNegotiateOwner.NegotiateForm.textOfferedPrice',
                                )}
                            </CustomText>
                            <View
                                testID="numericInput"
                                style={{
                                    marginTop: 10,
                                }}>
                                {offeredPrice && (
                                    <NumericInput
                                        type="up-down"
                                        totalWidth={210}
                                        totalHeight={50}
                                        step={100000}
                                        valueType="integer"
                                        editable={true}
                                        minValue={100000}
                                        maxValue={1000000000}
                                        value={price}
                                        rounded
                                        textColor={Color.darkTextColor}
                                        upDownButtonsBackgroundColor={
                                            Color.softPrimaryColor
                                        }
                                        borderColor={Color.primaryColor}
                                        onChange={price => setPrice(price)}
                                    />
                                )}
                            </View>
                        </View>
                        <View
                            testID="notesInput"
                            style={{
                                paddingTop: 20,
                                margin: -10,
                            }}>
                            <TextInput
                                leftIcon
                                placeholder={t(
                                    'FormNegotiateOwner.NegotiateForm.placeholderNotes',
                                )}
                                label={t(
                                    'FormNegotiateOwner.NegotiateForm.labelNotes',
                                )}
                                onBlur={handleBlur('notes')}
                                onChange={handleChange('notes')}
                                error={touched.notes && errors.notes}
                                value={values.notes}
                            />
                            {touched.notes && errors.notes && (
                                <TextInputError errorText={errors.notes} />
                            )}
                        </View>
                        <View
                            style={{
                                paddingTop: 20,
                            }}>
                            <View
                                style={{
                                    paddingBottom: 5,
                                }}>
                                <Text
                                    style={{
                                        fontFamily: FontFamily.medium,
                                        fontSize: FontSize.xl,
                                        color: Color.primaryColor,
                                    }}>
                                    {t(
                                        'FormNegotiateOwner.NegotiateForm.textLabelContract',
                                    )}
                                </Text>
                            </View>
                            <View
                                style={{
                                    paddingBottom: 25,
                                }}>
                                {selectedPdf ? (
                                    <View
                                        style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            borderBottomWidth: 1,
                                            borderBottomColor:
                                                Color.primaryColor,
                                            paddingBottom: 15,
                                        }}>
                                        <Text style={{ flex: 1 }}>
                                            {selectedPdf.name}
                                        </Text>
                                        {showDeleteButton && (
                                            <TouchableOpacity
                                                testID="deleteDocumentButton"
                                                onPress={() => {
                                                    setSelectedPdf(null);
                                                    setShowDeleteButton(false);
                                                }}>
                                                <CloseIcon />
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                ) : (
                                    <TouchableOpacity
                                        onPress={openPdfPicker}
                                        testID="documentPickerButton">
                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                borderBottomWidth: 1,
                                                borderBottomColor:
                                                    Color.primaryColor,
                                                paddingBottom: 15,
                                            }}>
                                            <Text style={{ flex: 1 }}>
                                                {t(
                                                    'FormNegotiateOwner.NegotiateForm.documentPickerButton',
                                                )}
                                            </Text>
                                            <PlusIcon />
                                        </View>
                                    </TouchableOpacity>
                                )}
                                {errorDocument && (
                                    <View
                                        marginT-24
                                        style={{
                                            marginLeft: -10,
                                        }}>
                                        <TextInputError
                                            errorText={t(
                                                'FormNegotiateOwner.NegotiateForm.errorDocumentEmpty',
                                            )}
                                        />
                                    </View>
                                )}
                            </View>
                        </View>

                        <View marginT-20>
                            <Button
                                testID="submitButton"
                                title={t(
                                    'FormNegotiateOwner.NegotiateForm.textSend',
                                )}
                                isSubmitting={isSubmitting}
                                onSubmit={() => handleSubmit()}
                            />
                        </View>
                    </>
                )}
            </Formik>
        </View>
    );
};

export default NegotiateForm;
