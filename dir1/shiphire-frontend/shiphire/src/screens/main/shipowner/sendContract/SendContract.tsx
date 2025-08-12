import React from 'react';
import { View, Text } from 'react-native-ui-lib';
import DocumentPicker, {
    DocumentPickerResponse,
} from 'react-native-document-picker';
import { Button, ScreenLayout } from '../../../../components';
import { SendContractProps } from '../../../../types';
import {
    CloseIcon,
    Color,
    FontFamily,
    FontSize,
    PlusIcon,
    RentIcon,
} from '../../../../configs';
import mime from 'mime';

import { TouchableOpacity } from 'react-native-gesture-handler';
import { Platform, Pressable } from 'react-native';
import { useDispatch } from 'react-redux';

import { ShipInformation, RenterInformation } from './components';
import { modalSlice, progressIndicatorSlice } from '../../../../slices';
import { useSubmitContract } from '../../../../hooks';
import { handleAxiosError } from '../../../../utils';
import { useTranslation } from 'react-i18next';

const SendContract: React.FC<SendContractProps> = ({ navigation, route }) => {
    const {
        shipId,
        rentalId,
        renterId,
        renterCompanyName,
        renterCompanyAddress,
        renterName,
        shipName,
        shipCategory,
        shipSize,
        shipCompanyType,
        shipCompanyName,
        shipDocuments,
        shipImageUrl,
        draftContract,
    } = route.params;
    console.log('route params: ', JSON.stringify(route.params, null, 2));
    const dispatch = useDispatch();
    const mutationSubmitContract = useSubmitContract();
    const [selectedContractPdf, setSelectedContractPdf] =
        React.useState<DocumentPickerResponse | null>(null);
    const [showDeleteContractButton, setShowDeleteContractButton] =
        React.useState(false);
    const formData = new FormData();
    const { hideModal, showModal } = modalSlice.actions;
    const [pdfFilePath, setPdfFilePath] = React.useState<string>('');
    const [pdfFilePathiOS, setPdfFilePathiOS] = React.useState<string>('');
    const { showProgressIndicator, hideProgressIndicator } =
        progressIndicatorSlice.actions;
    const { t } = useTranslation('common')    

    const newPdfFilePath =
        Platform.OS === 'ios' ? pdfFilePathiOS : 'file://' + pdfFilePath;

    const openPdfPickerContract = () => {
        DocumentPicker.pick({
            type: [DocumentPicker.types.pdf],
        })
            .then(result => {
                setSelectedContractPdf(result[0]);
                setShowDeleteContractButton(true);
            })
            .catch(error => {
                console.log('Error selecting PDF:', error);
            });
    };

    const isFormValid = () => {
        if (!selectedContractPdf) {
            return false;
        }

        return true;
    };

    const handleSubmitContract = () => {
        formData.append('document', {
            uri: selectedContractPdf?.uri,
            type: mime.getType(selectedContractPdf?.name),
            name: `Contract-${shipId}-${rentalId}`,
        });
        formData.append('shipId', shipId);
        formData.append('rentalId', rentalId);
        formData.append('renterId', renterId);
        formData.append('renterCompanyName', renterCompanyName);
        console.log('form data: ', formData);
        dispatch(showProgressIndicator());
        mutationSubmitContract.mutate(formData, {
            onSuccess: () => {
                dispatch(
                    showModal({
                        status: 'success',
                        text: t('OwnerContract.textSuccessContract'),
                    }),
                );
                setTimeout(() => {
                    navigation.navigate('OwnerTransactionTabNav');
                    dispatch(hideModal());
                    dispatch(hideProgressIndicator());
                }, 4000);
            },
            onError: err => {
                dispatch(hideProgressIndicator());
                dispatch(
                    showModal({
                        status: 'failed',
                        text: t('OwnerContract.textFailedContract'),
                    }),
                );
                setTimeout(() => {
                    dispatch(hideModal());
                }, 4000);
            },
        });
    };
    return (
        <ScreenLayout
            testId="sendContractScreen"
            backgroundColor="light"
            padding={10}
            gap={10}>
            <ShipInformation
                shipName={shipName}
                shipCategory={shipCategory}
                shipImageUrl={shipImageUrl}
                shipSize={shipSize}
                shipCompany={`${shipCompanyType}. ${shipCompanyName}`}
                shipDocument={shipDocuments}
                draftContract={draftContract}
            />
            <RenterInformation
                renterCompany={renterCompanyName}
                renterAddress={renterCompanyAddress}
                renterName={renterName}
            />
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
                        {t('OwnerContract.labelAttachContract')}
                    </Text>
                </View>
                <View
                    marginT-10
                    style={{
                        paddingBottom: 5,
                    }}>
                    <Text
                        style={{
                            fontFamily: FontFamily.medium,
                            fontSize: FontSize.xl,
                            color: Color.primaryColor,
                        }}>
                        {t('OwnerContract.labelContractFile')}
                    </Text>
                </View>
                <View
                    style={{
                        paddingBottom: 25,
                    }}>
                    {selectedContractPdf ? (
                        <View
                            testID="selectedContractPdf"
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                borderBottomWidth: 1,
                                borderBottomColor: Color.primaryColor,
                                paddingBottom: 15,
                            }}>
                            <Text style={{ flex: 1 }}>
                                {selectedContractPdf.name}
                            </Text>
                            {showDeleteContractButton && (
                                <TouchableOpacity
                                    onPress={() => {
                                        setSelectedContractPdf(null);
                                        setShowDeleteContractButton(false);
                                    }}>
                                    <CloseIcon />
                                </TouchableOpacity>
                            )}
                        </View>
                    ) : (
                        <TouchableOpacity
                            testID="selectContractButton"
                            onPress={openPdfPickerContract}>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    borderBottomWidth: 1,
                                    borderBottomColor: Color.primaryColor,
                                    paddingBottom: 15,
                                }}>
                                <Text style={{ flex: 1 }}>{t('OwnerContract.textSelectFile')}</Text>
                                <PlusIcon />
                            </View>
                        </TouchableOpacity>
                    )}
                </View>
                <Button
                    testID="submitButton"
                    title={t("OwnerContract.btnSubmit")}
                    onSubmit={handleSubmitContract}
                    disable={!isFormValid()}
                    isSubmitting={mutationSubmitContract.isLoading}
                />
            </View>
        </ScreenLayout>
    );
};

export default SendContract;
