import React from 'react';
import {
    CompleteNegotiationRequest,
    NegotiateFormProps,
} from '../../../../../types';
import { Text, View } from 'react-native-ui-lib';
import { Color, FontFamily, FontSize, RentIcon } from '../../../../../configs';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { Formik, FormikHelpers, FormikProps } from 'formik';
import {
    Button,
    CustomText,
    TextInput,
    TextInputError,
} from '../../../../../components';
import {
    useCompleteNegotiate,
    useSendRespondNegotiateContract,
} from '../../../../../hooks';
import { useDispatch } from 'react-redux';
import { modalSlice, progressIndicatorSlice } from '../../../../../slices';
import { handleAxiosError } from '../../../../../utils';
import CustomButton from '../../../../../components/Button';
import mime from 'mime';
import ModalInput from './ModalInput';
import { ImageOrVideo } from 'react-native-image-crop-picker';
import ImageInput from './ImageInput';
import ModalImage from './ModalImage';
import NumericInput from 'react-native-numeric-input';
import { ModalConfirm } from '.';
type AdditionalImage = {
    id: number;
    selectedImage: ImageOrVideo | null;
    imageNotes: string;
};

const NegotiateForm: React.FC<NegotiateFormProps> = ({
    navigation,
    rentalId,
    offeredPrice,
}) => {
    const { t } = useTranslation('common');
    const mutationSendRespondNegotiateContract =
        useSendRespondNegotiateContract();
    const mutationCompleteNegotiation = useCompleteNegotiate();
    const { hideProgressIndicator, showProgressIndicator } =
        progressIndicatorSlice.actions;
    const [selectedImage, setSelectedImage] = React.useState<AdditionalImage>({
        id: 0,
        selectedImage: null,
        imageNotes: '',
    });
    const [additionalImageList, setAdditionalImageList] = React.useState<
        AdditionalImage[]
    >([]);
    const dispatch = useDispatch();
    const { hideModal, showModal } = modalSlice.actions;
    const [visible, setvisible] = React.useState<boolean>(false);
    const [visiblePdf, setVisiblePdf] = React.useState<boolean>(false);
    const [price, setPrice] = React.useState<number | undefined>(offeredPrice);
    const [isConfirmationModalVisible, setConfirmationModalVisible] =
        React.useState(false);
    const handleShowModal = () => {
        setvisible(!visible);
    };
    const handleShowModalPdf = () => {
        setVisiblePdf(!visiblePdf);
    };
    const showConfirmationModal = () => {
        setConfirmationModalVisible(true);
    };
    const hideConfirmationModal = () => {
        setConfirmationModalVisible(false);
    };
    const confirmComplete = () => {
        hideConfirmationModal();
        handleCompleteNegotiation();
    };

    const formData = new FormData();
    const formValidationScheme: yup.ObjectSchema<{ notes: string }> = yup
        .object()
        .shape({
            notes: yup
                .string()
                .required(t('FormNegotiateRenter.NegotiateForm.validateNote')),
        });
    const formInitialValues: { notes: string } = {
        notes: '',
    };
    const handleForm = async (
        values: { notes: string },
        actions: FormikHelpers<{ notes: string }>,
    ) => {
        actions.setSubmitting(true);
        dispatch(showProgressIndicator());
        if (additionalImageList.length > 0) {
            additionalImageList.forEach((image, index) => {
                formData.append('files', {
                    uri: image.selectedImage?.path,
                    type: mime.getType(image.selectedImage?.path),
                    name: `Image Negotiate ${index + 1}`,
                });
                formData.append('imageNotes', image.imageNotes);
            });
        }
        formData.append('note', values.notes);
        formData.append('rentalId', rentalId);
        formData.append('offeredPrice', price);

        mutationSendRespondNegotiateContract.mutate(formData, {
            onSuccess: () => {
                dispatch(
                    showModal({
                        status: 'success',
                        text: t(
                            'FormNegotiateRenter.NegotiateForm.textSuccessForm',
                        ),
                    }),
                );
                setTimeout(() => {
                    navigation.reset({
                        index: 0,
                        routes: [
                            {
                                name: 'MainScreenTab',
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
                            'FormNegotiateRenter.NegotiateForm.textErrorForm',
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
    };

    const handleCompleteNegotiation = () => {
        dispatch(showProgressIndicator());

        // Assuming that rentalId is of type string | undefined
        if (rentalId) {
            // Create a CompleteNegotiationRequest object using rentalId
            const request: CompleteNegotiationRequest = {
                rentalId: rentalId,
            };

            // Call mutate with the valid request object
            mutationCompleteNegotiation.mutate(request, {
                onSuccess: () => {
                    dispatch(
                        showModal({
                            status: 'success',
                            text: 'Negotiation completed successfully',
                        }),
                    );
                    setTimeout(() => {
                        navigation.reset({
                            index: 0,
                            routes: [
                                {
                                    name: 'MainScreenTab',
                                },
                            ],
                        });
                        dispatch(hideModal());
                        dispatch(hideProgressIndicator());
                    }, 3000);
                },
                onError: err => {
                    dispatch(
                        showModal({
                            status: 'failed',
                            text: 'Failed to complete negotiation',
                        }),
                    );
                    setTimeout(() => {
                        dispatch(hideModal());
                        dispatch(hideProgressIndicator());
                    }, 2000);
                    handleAxiosError(err);
                },
            });
        } else {
            // Handle the case when rentalId is undefined
            console.error('Rental ID is undefined');
        }
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
                    {t('FormNegotiateRenter.NegotiateForm.textHeaderNegotiate')}
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
                        'FormNegotiateRenter.NegotiateForm.textNegotiateReplyDesc',
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
                }: FormikProps<{ notes: string }>) => (
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
                                    'FormNegotiateRenter.NegotiateForm.labelOfferPrice',
                                )}
                            </CustomText>
                            <View
                                testID="numericInput"
                                style={{
                                    marginTop: 10,
                                }}>
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
                                    'FormNegotiateRenter.NegotiateForm.placeholderNotes',
                                )}
                                label={t(
                                    'FormNegotiateRenter.NegotiateForm.labelNotes',
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
                                marginTop: 6,
                            }}>
                            <View
                                marginB-20
                                style={{
                                    justifyContent: 'space-between',
                                }}>
                                <CustomText
                                    color="primaryColor"
                                    fontSize="xl"
                                    fontFamily="medium">
                                    {t(
                                        'FormNegotiateRenter.NegotiateForm.labelImageAttachment',
                                    )}
                                </CustomText>
                                <View marginT-10 style={{ width: '50%' }}>
                                    <CustomButton
                                        testID="imageInputButton"
                                        title={t(
                                            'FormNegotiateRenter.NegotiateForm.textAddImage',
                                        )}
                                        onSubmit={() => handleShowModal()}
                                    />
                                </View>
                            </View>
                            <ImageInput
                                testId="imageInput"
                                setSelectedImage={setSelectedImage}
                                additionalImageList={additionalImageList}
                                openModal={handleShowModalPdf}
                                setAdditionalImageList={setAdditionalImageList}
                            />
                        </View>
                        <View
                            marginT-20
                            style={{
                                flex: 1,
                                gap: 10,
                                justifyContent: 'space-between',
                                flexDirection: 'row-reverse',
                            }}>
                            <View style={{ flex: 1 }}>
                                <Button
                                    testID="negoButton"
                                    title={t(
                                        'FormNegotiateRenter.NegotiateForm.textSend',
                                    )}
                                    isSubmitting={isSubmitting}
                                    onSubmit={() => handleSubmit()}
                                />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Button
                                    testID="submitButton"
                                    title={t(
                                        'FormNegotiateRenter.NegotiateForm.btnComplete',
                                    )}
                                    color="warning"
                                    isSubmitting={isSubmitting}
                                    onSubmit={showConfirmationModal}
                                />
                            </View>
                        </View>
                    </>
                )}
            </Formik>
            <ModalInput
                visible={visible}
                onClose={handleShowModal}
                additionalImageList={additionalImageList}
                setAdditionalImageList={setAdditionalImageList}
            />
            <ModalImage
                visible={visiblePdf}
                onClose={handleShowModalPdf}
                selectedImage={selectedImage}
            />
            <ModalConfirm
                isVisible={isConfirmationModalVisible}
                onConfirm={confirmComplete}
                onCancel={hideConfirmationModal}
            />
        </View>
    );
};

export default NegotiateForm;
