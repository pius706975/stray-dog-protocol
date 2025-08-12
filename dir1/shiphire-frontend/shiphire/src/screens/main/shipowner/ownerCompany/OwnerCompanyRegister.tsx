import { Formik, FormikHelpers, FormikProps } from 'formik';
import mime from 'mime';
import React from 'react';
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
import { useSubmitOwnerCompanyRegister } from '../../../../hooks';
import {
    modalSlice,
    progressIndicatorSlice,
    userStatusSlice,
} from '../../../../slices';
import {
    OwnerCompanyRegisterProps,
    OwnerCompanyRegisterRequest,
    RenterUserData,
} from '../../../../types';
import { handleAxiosError } from '../../../../utils';
import DropDownPicker from 'react-native-dropdown-picker';
import { useTranslation } from 'react-i18next';

const OwnerCompanyRegister: React.FC<OwnerCompanyRegisterProps> = ({}) => {
    const { t } = useTranslation('companyregister');
    const dispatch = useDispatch();
    const { hideModal, showModal } = modalSlice.actions;
    const { hideProgressIndicator, showProgressIndicator } =
        progressIndicatorSlice.actions;
    const { setCompanySubmitted } = userStatusSlice.actions;
    const mutationOwnerCompanyRegister = useSubmitOwnerCompanyRegister();

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

    const [open, setOpen] = React.useState(false);
    const [bank, setBank] = React.useState('');
    const [items, setItems] = React.useState([
        {
            label: '',
            value: 'BCA',
            icon: () => (
                <Image
                    source={{
                        uri: 'https://logos-download.com/wp-content/uploads/2017/03/BCA_logo_Bank_Central_Asia.png',
                    }}
                    style={{
                        height: 40,
                        width: 150,
                        // objectFit: 'contain',
                    }}
                />
            ),
            testID: 'item-bca',
        },
        {
            label: '',
            value: 'BNI',
            icon: () => (
                <Image
                    source={{
                        uri: 'https://logos-download.com/wp-content/uploads/2022/11/Bank_Negara_Indonesia_BNI_Logo.png',
                    }}
                    style={{
                        height: 40,
                        width: 150,
                        // objectFit: 'contain',
                    }}
                />
            ),
            testID: 'item-bni',
        },
        {
            label: '',
            value: 'BRI',
            icon: () => (
                <Image
                    source={{
                        uri: 'https://logos-download.com/wp-content/uploads/2016/06/Bank_BRI_logo_Bank_Rakyat_Indonesia.png',
                    }}
                    style={{
                        height: 40,
                        width: 150,
                        // objectFit: 'contain',
                    }}
                />
            ),
            testID: 'test-bri',
        },
        {
            label: '',
            value: 'Mandiri',
            icon: () => (
                <Image
                    source={{
                        uri: 'https://logos-download.com/wp-content/uploads/2016/06/Mandiri_logo.png',
                    }}
                    style={{
                        height: 40,
                        width: 150,
                        // objectFit: 'contain',
                    }}
                />
            ),
            testID: 'test-mandiri',
        },
        {
            label: '',
            value: 'BTN',
            icon: () => (
                <Image
                    source={{
                        uri: 'https://logos-download.com/wp-content/uploads/2022/11/Bank_BTN_Logo.png',
                    }}
                    style={{
                        height: 40,
                        width: 150,
                        // objectFit: 'contain',
                    }}
                />
            ),
            testID: 'test-btn',
        },
        {
            label: '',
            value: 'Permata',
            icon: () => (
                <Image
                    source={{
                        uri: 'https://logos-download.com/wp-content/uploads/2022/11/Permata_Bank_Logo.png',
                    }}
                    style={{
                        height: 40,
                        width: 150,
                        // objectFit: 'contain',
                    }}
                />
            ),
            testID: 'test-permata',
        },
    ]);

    const formData = new FormData();

    const OwnerCompanyRegisterValues: OwnerCompanyRegisterRequest = {
        companyName: '',
        typeOfCompany: '',
        companyAddress: '',
        bankName: '',
        bankAccountName: '',
        bankAccountNumber: '',
    };

    const ownerCompanyRegisterValidationScheme: yup.ObjectSchema<OwnerCompanyRegisterRequest> =
        yup.object().shape({
            companyName: yup.string().required('Company Name is required.'),
            typeOfCompany: yup
                .string()
                .required('Type of Company is required.'),
            companyAddress: yup.string().required('Company Address required'),
            bankName: yup.string(),
            bankAccountName: yup
                .string()
                .required('Bank Account Name required'),
            bankAccountNumber: yup
                .string()
                .required('Bank Account Number required'),
        });

    const checkingIsDocumentAndImageSubmitted = async (
        values: OwnerCompanyRegisterRequest,
        actions: FormikHelpers<OwnerCompanyRegisterRequest>,
    ) => {
        const valueRegisterWithBank: OwnerCompanyRegisterRequest = {
            ...values,
            bankName: bank,
        };

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
            submitOwnerCompanyRegisterData(valueRegisterWithBank, actions);
        }
    };

    const submitOwnerCompanyRegisterData = async (
        values: OwnerCompanyRegisterRequest,
        actions: FormikHelpers<OwnerCompanyRegisterRequest>,
    ) => {
        dispatch(showProgressIndicator());
        formData.append('companyName', values.companyName);
        formData.append('typeOfCompany', values.typeOfCompany);
        formData.append('companyAddress', values.companyAddress);
        formData.append('bankName', values.bankName);
        formData.append('bankAccountName', values.bankAccountName);
        formData.append('bankAccountNumber', values.bankAccountNumber);
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

        mutationOwnerCompanyRegister.mutate(formData, {
            onSuccess: () => {
                dispatch(hideProgressIndicator());
                dispatch(
                    showModal({
                        status: 'success',
                        text: t('textSuccess'),
                    }),
                );
                setDataToLocalStorage(COMPANYDATA, {
                    name: values.companyName,
                    address: values.companyAddress,
                });
                setDataToLocalStorage(USERDATA, {
                    ...userData,
                    isCompanySubmitted: true,
                });

                getDataFromLocalStorage(USERDATA).then(resp => {
                    console.log('resp', JSON.stringify(resp, null, 2));
                });

                dispatch(setCompanySubmitted());

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
                    initialValues={OwnerCompanyRegisterValues}
                    onSubmit={checkingIsDocumentAndImageSubmitted}
                    validationSchema={ownerCompanyRegisterValidationScheme}>
                    {({
                        handleBlur,
                        handleChange,
                        handleSubmit,
                        values,
                        touched,
                        errors,
                        isSubmitting,
                    }: FormikProps<OwnerCompanyRegisterRequest>) => (
                        <>
                            <View>
                                <TouchableOpacity
                                    testID="btn-image"
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
                                    placeholder="Ex: PT, CV, Persero,..."
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

                            <View style={{ paddingLeft: 10 }}>
                                <View
                                    style={{
                                        paddingBottom: 5,
                                        marginBottom: 20,
                                    }}>
                                    <Text
                                        style={{
                                            fontFamily: FontFamily.medium,
                                            fontSize: FontSize.xl,
                                            color: Color.primaryColor,
                                            marginBottom: 10,
                                        }}>
                                        {t('textSelectBank')}
                                    </Text>
                                    <DropDownPicker
                                        testID="bank-dd"
                                        open={open}
                                        value={bank}
                                        items={items}
                                        setOpen={setOpen}
                                        onPress={setOpen}
                                        setValue={setBank}
                                        setItems={setItems}
                                        mode="SIMPLE"
                                        listMode="MODAL"
                                        searchable={false}
                                        modalTitle={t('modalTitleBank')}
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
                                            height: 50,
                                            borderWidth: 1,
                                            borderRadius: 8,
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
                                    />
                                </View>
                            </View>

                            <View>
                                <TextInput
                                    leftIcon
                                    placeholder={t(
                                        'placeholderBankAccountName',
                                    )}
                                    label={t('textBankAccountName')}
                                    onBlur={handleBlur('bankAccountName')}
                                    onChange={handleChange('bankAccountName')}
                                    error={
                                        touched.bankAccountName &&
                                        errors.bankAccountName
                                    }
                                    value={values.bankAccountName}
                                />
                                {touched.bankAccountName &&
                                    errors.bankAccountName && (
                                        <TextInputError
                                            errorText={errors.bankAccountName}
                                        />
                                    )}
                            </View>

                            <View>
                                <TextInput
                                    leftIcon
                                    placeholder={t(
                                        'placeholderBankAccountNumber',
                                    )}
                                    label={t('textBankAccountNumber')}
                                    onBlur={handleBlur('bankAccountNumber')}
                                    onChange={handleChange('bankAccountNumber')}
                                    error={
                                        touched.bankAccountNumber &&
                                        errors.bankAccountNumber
                                    }
                                    value={values.bankAccountNumber}
                                />
                                {touched.bankAccountNumber &&
                                    errors.bankAccountNumber && (
                                        <TextInputError
                                            errorText={errors.bankAccountNumber}
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
                                            testID="btnLisence"
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
                                            testID="btnTax"
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
                                testID="btn-submit"
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

export default OwnerCompanyRegister;
