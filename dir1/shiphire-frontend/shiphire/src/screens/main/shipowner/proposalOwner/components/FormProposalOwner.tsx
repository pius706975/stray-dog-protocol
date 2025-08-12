import { Formik, FormikProps } from 'formik';
import React from 'react';
import { Text, View } from 'react-native-ui-lib';
import * as yup from 'yup';
import {
    TextInput,
    TextInputError,
    Button,
    CustomText,
} from '../../../../../components';
import {
    CloseIcon,
    Color,
    FontFamily,
    FontSize,
    PlusIcon,
    RentIcon,
} from '../../../../../configs';
import {
    FormProposalOwnerProps,
    ProposalOwnerParamList,
    ProposalOwnerRequest,
} from '../../../../../types';
import NumericInput from 'react-native-numeric-input';
import { useSubmitProposalOwner } from '../../../../../hooks';
import { Pressable } from 'react-native';

import DocumentPicker, {
    DocumentPickerResponse,
} from 'react-native-document-picker';
import { useTranslation } from 'react-i18next';
import CustomButton from '../../../../../components/Button';
import DocumentInput from './DocumentInput';
import ModalInput from './ModalInput';
import ModalPdf from './ModalPdf';
import { useDispatch } from 'react-redux';
import { modalSlice, progressIndicatorSlice } from '../../../../../slices';
import mime from 'mime';
import { handleAxiosError } from '../../../../../utils';

type AdditionalDocument = {
    id: number;
    name: string;
    uri: string;
    type: string;
};

const FormProposalOwner: React.FC<FormProposalOwnerProps> = ({
    categoryId,
    shipOwnerId,
    shipId,
    shipName,
    shipCategory,
    renterId,
    navigation,
    rentalId,
    renterData,
    renterUserData,
    shipOwnerUserData,
    shipOwnerCompanyData,
    rentalDuration,
    rentalStartDate,
    rentalEndDate,
    offeredPrice,
}) => {
    const { t } = useTranslation('common');
    const [price, setPrice] = React.useState<number | undefined>(offeredPrice);
    const [selectedFile, setSelectedFile] =
        React.useState<DocumentPickerResponse | null>(null);
    const [additionalDocList, setAdditionalDocList] = React.useState<
        AdditionalDocument[]
    >([]);
    const [selectedDocument, setSelectedDocument] =
        React.useState<AdditionalDocument>({
            id: 0,
            name: '',
            uri: '',
            type: '',
        });
    const [visiblePdf, setVisiblePdf] = React.useState<boolean>(false);
    // const startDate = moment(rentalStartDate).utc().format('DD MMMM YYYY');
    // const endDate = moment(rentalEndDate).utc().format('DD MMMM YYYY');
    const [showDeleteButton, setShowDeleteButton] =
        React.useState<boolean>(false);
    const [visible, setvisible] = React.useState<boolean>(false);
    const handleShowModal = () => {
        setvisible(!visible);
    };
    const handleShowModalPdf = () => {
        setVisiblePdf(!visiblePdf);
    };
    const dispatch = useDispatch();
    const { hideProgressIndicator, showProgressIndicator } =
        progressIndicatorSlice.actions;
    const mutationSubmitProposal = useSubmitProposalOwner();
    const { hideModal, showModal } = modalSlice.actions;
    const formData = new FormData();
    const [errorDocument, setErrorDocument] = React.useState<Boolean>(false);
    const formValidationScheme: yup.ObjectSchema<ProposalOwnerRequest> = yup
        .object()
        .shape({
            note: yup
                .string()
                .required(t('FormProposalOwner.textRequiredNote')),
        });

    const formInitialValues: ProposalOwnerRequest = {
        note: '',
    };
    // console.log('cek', price);
    const handleForm = async (values: ProposalOwnerRequest) => {
        // await generateProposalDocument(
        //     values,
        //     shipName,
        //     shipCategory,
        //     renterData,
        //     renterUserData,
        //     shipOwnerUserData,
        //     shipOwnerCompanyData,
        //     rentalDuration,
        //     startDate,
        //     endDate,
        //     price,
        // );
        // navigation.navigate('DocPreviewProposalOwner', {
        //     shipOwnerId,
        //     shipId,
        //     renterId,
        //     offeredPrice: price,
        //     rentalId,
        //     categoryId,
        // });
        if (selectedFile === null) {
            setErrorDocument(true);
        } else {
            setErrorDocument(false);
            formData.append('shipId', shipId);
            formData.append('renterId', renterId);
            formData.append('offeredPrice', price);
            formData.append('rentalId', rentalId);
            formData.append('note', values.note);
            formData.append('draftContract', {
                uri: selectedFile?.uri,
                type: mime.getType(selectedFile?.name),
                name: `Proposal-${shipId}-${shipId}`,
            });
            if (additionalDocList.length > 0) {
                additionalDocList.forEach(item => {
                    formData.append('otherDoc', {
                        uri: item.uri,
                        type: item.type,
                        name: item.name,
                    });
                });
            }
            dispatch(showProgressIndicator());
            mutationSubmitProposal.mutate(formData, {
                onSuccess: () => {
                    dispatch(
                        showModal({
                            status: 'success',
                            text: t('FormProposalOwner.textProposalSent'),
                        }),
                    );
                    setTimeout(() => {
                        navigation.reset({
                            index: 0,
                            routes: [
                                {
                                    name: 'ShipOwnerHome' as keyof ProposalOwnerParamList,
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
                            text: t('FormProposalOwner.textFailedSentProposal'),
                        }),
                    );
                    setTimeout(() => {
                        dispatch(hideModal());
                        dispatch(hideProgressIndicator());
                    }, 2000);

                    handleAxiosError(err);
                },
            });
        }
    };

    const openPdfPickerDocument = () => {
        DocumentPicker.pick({
            type: [DocumentPicker.types.pdf],
        })
            .then(result => {
                setSelectedFile(result[0]);
                setShowDeleteButton(true);
                // setSelectedValue(result[0]);
            })
            .catch(error => {
                console.log('Error selecting PDF:', error);
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
                    {t('FormProposalOwner.textProposalReply')}
                </Text>
            </View>

            <View>
                <Text
                    style={{
                        fontSize: FontSize.lg,
                        fontFamily: FontFamily.regular,
                        color: Color.darkTextColor,
                    }}>
                    {t('FormProposalOwner.textProposalReplyDesc')}{' '}
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
                }: FormikProps<ProposalOwnerRequest>) => (
                    <>
                        <View>
                            <View
                                style={{
                                    marginTop: 10,
                                }}>
                                <Text
                                    style={{
                                        fontFamily: FontFamily.medium,
                                        fontSize: FontSize.xl,
                                        color: Color.primaryColor,
                                        paddingRight: 10,
                                    }}>
                                    {t('FormProposalOwner.textOfferedPrice')}
                                </Text>
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <View
                                    style={{
                                        alignSelf: 'center',
                                    }}>
                                    <Text
                                        style={{
                                            fontFamily: FontFamily.medium,
                                            fontSize: FontSize.xl,
                                            color: Color.primaryColor,
                                            paddingRight: 10,
                                        }}>
                                        Rp
                                    </Text>
                                </View>
                                <View
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
                                style={{
                                    paddingTop: 20,
                                    margin: -10,
                                }}>
                                <TextInput
                                    leftIcon
                                    placeholder={t(
                                        'FormProposalOwner.textInsertNote',
                                    )}
                                    label={t('FormProposalOwner.textNote')}
                                    onBlur={handleBlur('note')}
                                    onChange={handleChange('note')}
                                    error={touched.note && errors.note}
                                    value={values.note}
                                />
                                {touched.note && errors.note && (
                                    <TextInputError errorText={errors.note} />
                                )}
                            </View>
                            <View paddingT-10>
                                <Text
                                    marginB-10
                                    style={{
                                        fontFamily: FontFamily.medium,
                                        fontSize: FontSize.xl,
                                        color: Color.primaryColor,
                                        paddingRight: 10,
                                    }}>
                                    {t('FormProposalOwner.textDraftContract')}
                                </Text>
                                {selectedFile ? (
                                    <View
                                        row
                                        centerV
                                        paddingB-15
                                        style={{
                                            borderBottomWidth: 1,
                                            borderBottomColor: errorDocument
                                                ? Color.errorColor
                                                : Color.primaryColor,
                                            justifyContent: 'space-between',
                                        }}>
                                        <CustomText
                                            color="primaryColor"
                                            fontFamily="regular"
                                            fontSize="md">
                                            {selectedFile.name}
                                        </CustomText>
                                        {showDeleteButton && (
                                            <Pressable
                                                onPress={() => {
                                                    setSelectedFile(null);
                                                    setShowDeleteButton(false);
                                                    // setUnselectValue();
                                                }}>
                                                <CloseIcon />
                                            </Pressable>
                                        )}
                                    </View>
                                ) : (
                                    <Pressable
                                        testID="proposalPicker"
                                        onPress={openPdfPickerDocument}>
                                        <View
                                            row
                                            centerV
                                            paddingB-15
                                            style={{
                                                borderBottomWidth: 1,
                                                borderBottomColor: errorDocument
                                                    ? Color.errorColor
                                                    : Color.primaryColor,
                                                justifyContent: 'space-between',
                                            }}>
                                            <CustomText
                                                color="darkTextColor"
                                                fontFamily="regular"
                                                fontSize="md">
                                                {t(
                                                    'FormProposalOwner.AdditionalDocument.textSelectFile',
                                                )}
                                            </CustomText>
                                            <PlusIcon />
                                        </View>
                                    </Pressable>
                                )}
                                {errorDocument && (
                                    <View
                                        marginT-24
                                        style={{
                                            marginLeft: -10,
                                        }}>
                                        <TextInputError
                                            errorText={t(
                                                'FormProposalOwner.AdditionalDocument.validationDocument',
                                            )}
                                        />
                                    </View>
                                )}
                            </View>
                            <View marginT-20>
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
                                            'FormProposalOwner.AdditionalDocument.textAdditionalDocument',
                                        )}
                                    </CustomText>
                                    <View marginT-10 style={{ width: '50%' }}>
                                        <CustomButton
                                            testID="add-input-additional-doc"
                                            title={t(
                                                'FormProposalOwner.AdditionalDocument.textAddDocument',
                                            )}
                                            onSubmit={() => handleShowModal()}
                                        />
                                    </View>
                                </View>
                                <DocumentInput
                                    setSelectedDocument={setSelectedDocument}
                                    additionalDocList={additionalDocList}
                                    openModal={handleShowModalPdf}
                                    setAdditionalDocList={setAdditionalDocList}
                                />
                            </View>
                            <View
                                style={{
                                    marginTop: 16,
                                }}></View>
                        </View>
                        <Button
                            testID="btn-submit-proposal"
                            title={t('FormProposalOwner.textSubmit')}
                            isSubmitting={isSubmitting}
                            onSubmit={() => handleSubmit()}
                        />
                    </>
                )}
            </Formik>
            <ModalInput
                visible={visible}
                onClose={handleShowModal}
                additionalDocList={additionalDocList}
                setAdditionalDocList={setAdditionalDocList}
            />
            <ModalPdf
                visible={visiblePdf}
                onClose={handleShowModalPdf}
                selectedDocument={selectedDocument}
            />
        </View>
    );
};

export default FormProposalOwner;
