import { Formik, FormikHelpers, FormikProps } from 'formik';
import mime from 'mime';
import React from 'react';
import { useTranslation } from 'react-i18next';
import DocumentPicker, {
    DocumentPickerResponse,
} from 'react-native-document-picker';
import ImagePicker, { ImageOrVideo } from 'react-native-image-crop-picker';
import { Image, Text, TouchableOpacity, View } from 'react-native-ui-lib';
import { useDispatch } from 'react-redux';
import * as yup from 'yup';
import {
    Button,
    ScreenLayout,
    TextInput,
    TextInputError,
} from '../../../../components';
import {
    COMPANYDATA,
    CloseIcon,
    Color,
    PlusIcon,
    USERDATA,
    getDataFromLocalStorage,
    setDataToLocalStorage,
} from '../../../../configs';
import { FontFamily, FontSize } from '../../../../configs/Fonts';
import { useSubmitCompanyProfile } from '../../../../hooks';
import { modalSlice, progressIndicatorSlice } from '../../../../slices';
import {
    CompanyRegisterProps,
    CompanyRegisterRequest,
    RenterUserData,
    UserData,
} from '../../../../types';
import { handleAxiosError } from '../../../../utils';

const CompanyRegister: React.FC<CompanyRegisterProps> = ({ navigation }) => {
    const dispatch = useDispatch();
    const { t } = useTranslation('companyregister');
    const { hideModal, showModal } = modalSlice.actions;
    const { hideProgressIndicator, showProgressIndicator } =
        progressIndicatorSlice.actions;
    const mutationSubmitCompanyProfile = useSubmitCompanyProfile();

    const [selectedBusinessPdf, setSelectedBusinessPdf] =
        React.useState<DocumentPickerResponse | null>(null);
    const [selectedTaxIDPdf, setSelectedTaxIDPdf] =
        React.useState<DocumentPickerResponse | null>(null);
    const [showDeleteBusinessButton, setShowDeleteBusinessButton] =
        React.useState(false);
    const [showDeleteTaxIDButton, setShowDeleteTaxIDButton] =
        React.useState(false);
    const [selectedImage, setSelectedImage] = React.useState<ImageOrVideo>();
    const [userData, setUserData] = React.useState<RenterUserData>();

    const formData = new FormData();

    const CompanyRegisterValues: CompanyRegisterRequest = {
        companyName: '',
        typeOfCompany: '',
        companyAddress: '',
    };

    const companyRegisterValidationScheme: yup.ObjectSchema<CompanyRegisterRequest> =
        yup.object().shape({
            companyName: yup.string().required('Company Name is required.'),
            typeOfCompany: yup
                .string()
                .required('Type of Company is required.'),
            companyAddress: yup.string().required('Company Address required'),
        });

    const checkingIsDocumentAndImageSubmitted = async (
        values: CompanyRegisterRequest,
        actions: FormikHelpers<CompanyRegisterRequest>,
    ) => {
        if (selectedBusinessPdf === null) {
            dispatch(hideProgressIndicator());
            dispatch(
                showModal({
                    status: 'failed',
                    text: t('failedBusinessLicenseNumber'),
                }),
            );
            setTimeout(() => {
                dispatch(hideModal());
            }, 4000);
            actions.setSubmitting(false);
            return;
        } else if (selectedTaxIDPdf === null) {
            dispatch(hideProgressIndicator());
            dispatch(
                showModal({
                    status: 'failed',
                    text: t('failedTaxIDNumber'),
                }),
            );
            setTimeout(() => {
                dispatch(hideModal());
            }, 4000);
            actions.setSubmitting(false);
            return;
        } else if (selectedImage?.path === undefined) {
            dispatch(hideProgressIndicator());
            dispatch(
                showModal({
                    status: 'failed',
                    text: t('failedCompanyImage'),
                }),
            );
            setTimeout(() => {
                dispatch(hideModal());
            }, 4000);
            actions.setSubmitting(false);
            return;
        } else {
            submitCompanyData(values, actions);
        }
    };
    const submitCompanyData = async (
        values: CompanyRegisterRequest,
        actions: FormikHelpers<CompanyRegisterRequest>,
    ) => {
        dispatch(showProgressIndicator());
        formData.append('companyName', values.companyName);
        formData.append('typeOfCompany', values.typeOfCompany);
        formData.append('companyAddress', values.companyAddress);

        formData.append('files', {
            uri: selectedBusinessPdf?.uri,
            type: mime.getType(selectedBusinessPdf?.name),
            name: `Business License Document ${values.companyName}`,
        });
        formData.append('files', {
            uri: selectedTaxIDPdf?.uri,
            type: mime.getType(selectedTaxIDPdf?.name),
            name: `Tax ID Number Document ${values.companyName}`,
        });
        formData.append('files', {
            uri: selectedImage?.path,
            type: mime.getType(selectedImage?.path),
            name: `Image ${values.companyName}`,
        });

        mutationSubmitCompanyProfile.mutate(formData, {
            onSuccess: () => {
                dispatch(hideProgressIndicator());
                dispatch(
                    showModal({
                        status: 'success',
                        text: t('successSubmitted'),
                    }),
                );
                setDataToLocalStorage(COMPANYDATA, {
                    name: values.companyName,
                    companyType: values.typeOfCompany,
                    address: values.companyAddress,
                });
                setDataToLocalStorage(USERDATA, {
                    ...userData,
                    isCompanySubmitted: true,
                });
                getDataFromLocalStorage(USERDATA).then(resp => {
                    console.log(JSON.stringify(resp, null, 2));
                });

                navigation.reset({
                    index: 0,
                    routes: [{ name: 'MainScreenTab' }],
                });
                setTimeout(() => {
                    dispatch(hideModal());
                }, 4000);
                actions.setSubmitting(false);
            },
            onError: err => {
                dispatch(hideProgressIndicator());
                handleAxiosError(err);
            },
        });
    };

    const openImage = () => {
        ImagePicker.openPicker({
            width: 300,
            height: 400,
            cropping: true,
        })
            .then(image => {
                setSelectedImage(image);
            })
            .catch(e => console.log(e));
    };

    const openPdfPickerBusiness = () => {
        DocumentPicker.pick({
            type: [DocumentPicker.types.pdf],
        })
            .then(result => {
                setSelectedBusinessPdf(result[0]);
                setShowDeleteBusinessButton(true);
            })
            .catch(error => {
                console.log('Error selecting PDF:', error);
            });
    };
    const openPdfPickerDeed = () => {
        DocumentPicker.pick({
            type: [DocumentPicker.types.pdf],
        })
            .then(result => {
                setSelectedTaxIDPdf(result[0]);
                setShowDeleteTaxIDButton(true);
            })
            .catch(error => {
                console.log('Error selecting PDF:', error);
            });
    };

    React.useEffect(() => {
        getDataFromLocalStorage(USERDATA).then(resp => {
            setUserData(resp);
        });
    }, []);

    // console.log(selectedBusinessPdf?.type)
    // console.log(selectedTaxIDPdf?.name)

    return (
        <ScreenLayout
            testId="CompanyRegisterScreen"
            backgroundColor="light"
            padding={10}
            gap={10}>
            <View
                style={{
                    padding: 10,
                }}>
                <Text
                    style={{
                        fontFamily: FontFamily.regular,
                        fontSize: FontSize.md,
                    }}>
                    {t('textComplete')}
                </Text>
            </View>
            <View>
                <Formik
                    initialValues={CompanyRegisterValues}
                    onSubmit={checkingIsDocumentAndImageSubmitted}
                    validationSchema={companyRegisterValidationScheme}>
                    {({
                        handleBlur,
                        handleChange,
                        handleSubmit,
                        values,
                        touched,
                        errors,
                        isSubmitting,
                    }: FormikProps<CompanyRegisterRequest>) => (
                        <>
                            <View>
                                <TouchableOpacity
                                    testID="imageField"
                                    style={{
                                        marginTop: 20,
                                        width: 150,
                                        height: 150,
                                        borderRadius: 100 / 2,
                                        alignSelf: 'center',
                                    }}
                                    onPress={openImage}>
                                    <View
                                        style={{
                                            alignSelf: 'center',
                                            marginTop: -20,
                                        }}>
                                        {selectedImage ? (
                                            <Image
                                                source={{
                                                    uri: selectedImage.path,
                                                }}
                                                style={{
                                                    width: 150,
                                                    height: 150,
                                                    borderRadius: 100 / 2,
                                                }}
                                            />
                                        ) : (
                                            <View>
                                                <Image
                                                    source={require('../../../../../assets/images/Empty.jpg')}
                                                    style={{
                                                        width: 150,
                                                        height: 150,
                                                        borderRadius: 100 / 2,
                                                    }}
                                                />
                                                <View
                                                    style={{
                                                        position: 'absolute',
                                                        top: '50%',
                                                        left: '50%',
                                                        transform: [
                                                            { translateX: -15 },
                                                            { translateY: -15 },
                                                        ],
                                                        backgroundColor:
                                                            'rgba(255, 255, 255, 0.7)',
                                                        width: 30,
                                                        height: 30,
                                                        borderRadius: 15,
                                                        alignItems: 'center',
                                                        justifyContent:
                                                            'center',
                                                    }}>
                                                    <PlusIcon />
                                                </View>
                                            </View>
                                        )}
                                    </View>
                                </TouchableOpacity>
                            </View>

                            <View>
                                <TextInput
                                    leftIcon
                                    placeholder={t('placeholderCompanyName')}
                                    label={t('labelCompanyName')}
                                    onBlur={handleBlur('companyName')}
                                    onChange={handleChange('companyName')}
                                    error={
                                        touched.companyName &&
                                        errors.companyName
                                    }
                                    value={values.companyName}
                                />
                                {touched.companyName && errors.companyName && (
                                    <TextInputError
                                        errorText={errors.companyName}
                                    />
                                )}
                            </View>
                            <View>
                                <TextInput
                                    leftIcon
                                    placeholder={t('placeholderTypeofCompany')}
                                    label={t('labelTypeofCompany')}
                                    onBlur={handleBlur('typeOfCompany')}
                                    onChange={handleChange('typeOfCompany')}
                                    error={
                                        touched.typeOfCompany &&
                                        errors.typeOfCompany
                                    }
                                    value={values.typeOfCompany}
                                />
                                {touched.typeOfCompany &&
                                    errors.typeOfCompany && (
                                        <TextInputError
                                            errorText={errors.typeOfCompany}
                                        />
                                    )}
                            </View>
                            <View>
                                <TextInput
                                    leftIcon
                                    placeholder={t('placeholderCompanyAddress')}
                                    label={t('labelCompanyAddress')}
                                    onBlur={handleBlur('companyAddress')}
                                    onChange={handleChange('companyAddress')}
                                    error={
                                        touched.companyAddress &&
                                        errors.companyAddress
                                    }
                                    value={values.companyAddress}
                                />
                                {touched.companyAddress &&
                                    errors.companyAddress && (
                                        <TextInputError
                                            errorText={errors.companyAddress}
                                        />
                                    )}
                            </View>

                            <View
                                style={{
                                    paddingLeft: 10,
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
                                        {t('textBusinessLicenseNumber')}
                                    </Text>
                                </View>
                                <View
                                    style={{
                                        paddingBottom: 25,
                                    }}>
                                    {selectedBusinessPdf ? (
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
                                                {selectedBusinessPdf.name}
                                            </Text>
                                            {showDeleteBusinessButton && (
                                                <TouchableOpacity
                                                    testID="deleteBusinessButton"
                                                    onPress={() => {
                                                        setSelectedBusinessPdf(
                                                            null,
                                                        );
                                                        setShowDeleteBusinessButton(
                                                            false,
                                                        );
                                                    }}>
                                                    <CloseIcon />
                                                </TouchableOpacity>
                                            )}
                                        </View>
                                    ) : (
                                        <TouchableOpacity
                                            testID="businessLicenseNumber"
                                            onPress={openPdfPickerBusiness}>
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
                                                    {t('textSelectFile')}
                                                </Text>
                                                <PlusIcon />
                                            </View>
                                        </TouchableOpacity>
                                    )}
                                </View>
                            </View>

                            <View
                                style={{
                                    paddingLeft: 10,
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
                                        {t('textTaxIDNumber')}
                                    </Text>
                                </View>
                                <View
                                    style={{
                                        paddingBottom: 25,
                                    }}>
                                    {selectedTaxIDPdf ? (
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
                                                {selectedTaxIDPdf.name}
                                            </Text>
                                            {showDeleteTaxIDButton && (
                                                <TouchableOpacity
                                                    testID="deleteTaxIDButton"
                                                    onPress={() => {
                                                        setSelectedTaxIDPdf(
                                                            null,
                                                        );
                                                        setShowDeleteTaxIDButton(
                                                            false,
                                                        );
                                                    }}>
                                                    <CloseIcon />
                                                </TouchableOpacity>
                                            )}
                                        </View>
                                    ) : (
                                        <TouchableOpacity
                                            testID="taxID"
                                            onPress={openPdfPickerDeed}>
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
                                                    {t('textSelectFile')}
                                                </Text>
                                                <PlusIcon />
                                            </View>
                                        </TouchableOpacity>
                                    )}
                                </View>
                            </View>
                            <Button
                                testID="submitButton"
                                title={t('labelButtonSubmit')}
                                isSubmitting={isSubmitting}
                                onSubmit={() => handleSubmit()}
                            />
                        </>
                    )}
                </Formik>
            </View>
        </ScreenLayout>
    );
};

export default CompanyRegister;
