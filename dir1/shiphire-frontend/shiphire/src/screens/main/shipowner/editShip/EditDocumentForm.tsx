import mime from 'mime';
import React from 'react';
import DocumentPicker, {
    DocumentPickerResponse,
} from 'react-native-document-picker';
import { Text, TouchableOpacity, View } from 'react-native-ui-lib';
import { useDispatch } from 'react-redux';
import { Button, ScreenLayout } from '../../../../components';
import {
    ArrowIcon,
    CloseIcon,
    Color,
    FontFamily,
    FontSize,
    PlusIcon,
} from '../../../../configs';
import { useEditShipDocument } from '../../../../hooks';
import { modalSlice, progressIndicatorSlice } from '../../../../slices';
import { EditDocumentFormProps } from '../../../../types';
import { useTranslation } from 'react-i18next';

const EditDocumentForm: React.FC<EditDocumentFormProps> = ({
    navigation,
    route,
}) => {
    const dispatch = useDispatch();
    const { t } = useTranslation('detailship');
    const { shipId, documentName, documentUrl } = route.params;
    const { showProgressIndicator, hideProgressIndicator } =
        progressIndicatorSlice.actions;
    const { showModal, hideModal } = modalSlice.actions;
    const [selectedPdf, setSelectedPdf] =
        React.useState<DocumentPickerResponse | null>(null);
    const [showDeleteButton, setShowDeleteButton] = React.useState(false);
    const mutationEditShipDocument = useEditShipDocument();
    const documentFormData = new FormData();

    const openPdfPickerBusiness = () => {
        DocumentPicker.pick({
            type: [DocumentPicker.types.pdf],
        })
            .then(result => {
                setSelectedPdf(result[0]);
                setShowDeleteButton(true);
            })
            .catch(error => {
                console.log('Error selecting PDF:', error);
            });
    };

    const handleSubmit = () => {
        dispatch(showProgressIndicator());
        if (selectedPdf) {
            if (selectedPdf.name == documentName) {
                dispatch(hideProgressIndicator());
                dispatch(
                    showModal({
                        status: 'failed',
                        text: t('ShipOwner.EditDocumentForm.failedPdfNameSame'),
                    }),
                );
                setTimeout(() => {
                    dispatch(hideModal());
                }, 2000);
            } else {
                documentFormData.append('files', {
                    uri: selectedPdf.uri,
                    type: mime.getType(selectedPdf.name),
                    name: `Ship ${selectedPdf.name} Owner Document 1`,
                });
                mutationEditShipDocument.mutate(
                    {
                        request: documentFormData,
                        shipId,
                    },
                    {
                        onSuccess: resp => {
                            dispatch(hideProgressIndicator());
                            dispatch(
                                showModal({
                                    status: 'success',
                                    text: t(
                                        'ShipOwner.EditDocumentForm.successEditDocument',
                                    ),
                                }),
                            );
                            navigation.navigate('OwnerDetailShip', {
                                shipId: resp.data.data.shipId,
                            });
                            setTimeout(() => {
                                dispatch(hideModal());
                            }, 2000);
                        },
                    },
                );
            }
        } else {
            dispatch(hideProgressIndicator());
            dispatch(
                showModal({
                    status: 'failed',
                    text: t('ShipOwner.EditDocumentForm.failedPdfNameSame'),
                }),
            );
            setTimeout(() => {
                dispatch(hideModal());
            }, 2000);
        }
    };

    React.useEffect(() => {
        const initialShipDocumentData = {
            uri: 'string',
            name: documentName,
            copyError: '',
            fileCopyUri: '',
            type: 'application/pdf',
            size: 0,
        };
        if (documentName !== null) {
            setSelectedPdf(initialShipDocumentData);
            setShowDeleteButton(true);
        }
    }, []);

    return (
        <ScreenLayout backgroundColor={'light'} testId={'documentFormAddShip'}>
            <View marginH-20 marginV-26>
                <View>
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
                            {t('ShipOwner.EditDocumentForm.labelDocument1')}
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
                                    borderBottomColor: Color.primaryColor,
                                    paddingBottom: 15,
                                }}>
                                <Text style={{ flex: 1 }}>
                                    {selectedPdf.name}
                                </Text>
                                {showDeleteButton && (
                                    <TouchableOpacity
                                        onPress={() => {
                                            setSelectedPdf(null);
                                            setShowDeleteButton(false);
                                        }}>
                                        <CloseIcon />
                                    </TouchableOpacity>
                                )}
                            </View>
                        ) : (
                            <TouchableOpacity onPress={openPdfPickerBusiness}>
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        borderBottomWidth: 1,
                                        borderBottomColor: Color.primaryColor,
                                        paddingBottom: 15,
                                    }}>
                                    <Text style={{ flex: 1 }}>
                                        {' '}
                                        {t(
                                            'ShipOwner.EditImageForm.textSelectFile',
                                        )}
                                    </Text>
                                    <PlusIcon />
                                </View>
                            </TouchableOpacity>
                        )}
                    </View>

                    <View
                        style={{
                            flex: 1,
                            justifyContent: 'flex-end',
                        }}></View>
                </View>

                <Button
                    rightIcon={<ArrowIcon />}
                    title={t('ShipOwner.EditImageForm.labelButtonNext')}
                    onSubmit={() => handleSubmit()}
                />
            </View>
        </ScreenLayout>
    );
};

export default EditDocumentForm;
