import React from 'react';
import { Modal, View } from 'react-native-ui-lib';
import {
    CustomText,
    TextInput,
    TextInputError,
} from '../../../../../components';
import CustomButton from '../../../../../components/Button';
import { Pressable } from 'react-native';
import { CloseIcon, Color, PlusIcon } from '../../../../../configs';
import DocumentPicker, {
    DocumentPickerResponse,
} from 'react-native-document-picker';
import mime from 'mime';
import { useTranslation } from 'react-i18next';

const ModalInput = ({
    visible,
    onClose,
    additionalDocList,
    setAdditionalDocList,
}) => {
    const { t } = useTranslation('common');
    const [selectedFile, setSelectedFile] =
        React.useState<DocumentPickerResponse | null>(null);
    const [showDeleteButton, setShowDeleteButton] =
        React.useState<boolean>(false);
    const [docName, setDocName] = React.useState('');
    const [error, setError] = React.useState({ name: false, doc: false });
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

    const handleAddDoc = () => {
        if (docName !== '' && selectedFile) {
            setError({ name: false, doc: false });
            setAdditionalDocList([
                ...additionalDocList,
                {
                    id: Date.now(),
                    name: docName,
                    uri: selectedFile.uri,
                    type: mime.getType(selectedFile?.name),
                },
            ]);
            setDocName('');
            setSelectedFile(null);
            onClose();
        } else {
            setError({ name: true, doc: true });
        }
    };
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}>
            <View
                flex-1
                style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(0,0,0,0.7)',
                }}>
                <View
                    style={{
                        backgroundColor: Color.bgColor,
                        padding: 16,
                        borderRadius: 8,
                        width: '83%',
                    }}>
                    <View
                        style={{
                            paddingTop: 20,
                            margin: -10,
                        }}>
                        <TextInput
                            leftIcon
                            placeholder={t('FormProposalOwner.AdditionalDocument.textDocumentName')}
                            label={t(
                                'FormProposalOwner.AdditionalDocument.textDocumentName',
                            )}
                            onChange={e => setDocName(e)}
                            value={docName}
                        />
                        {docName === '' && error.name && (
                            <TextInputError
                                errorText={t(
                                    'FormProposalOwner.AdditionalDocument.validationDocumentName',
                                )}
                            />
                        )}
                    </View>
                    <View
                        style={{
                            paddingTop: 20,
                        }}>
                        <View paddingB-25>
                            <CustomText
                                color="primaryColor"
                                fontSize="xl"
                                fontFamily="medium">
                                {t(
                                    'FormProposalOwner.AdditionalDocument.textDocument',
                                )}
                            </CustomText>
                        </View>
                        <View paddingB-15>
                            {selectedFile ? (
                                <View
                                    row
                                    centerV
                                    paddingB-15
                                    style={{
                                        borderBottomWidth: 1,
                                        borderBottomColor: error.doc
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
                                    testID="additional-doc-pressable"
                                    onPress={openPdfPickerDocument}>
                                    <View
                                        row
                                        centerV
                                        paddingB-15
                                        style={{
                                            borderBottomWidth: 1,
                                            borderBottomColor: error.doc
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
                        </View>
                        {selectedFile === null && error.doc && (
                            <View
                                marginT-10
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
                    <View row style={{ justifyContent: 'center' }}>
                        <View
                            style={{
                                marginTop: 15,
                                marginRight: 15,
                            }}>
                            <CustomButton
                                title={t(
                                    'FormProposalOwner.AdditionalDocument.textCancel',
                                )}
                                onSubmit={onClose}
                                color="error"
                            />
                        </View>
                        <View
                            style={{
                                marginTop: 15,
                            }}>
                            <CustomButton
                                testID="btn-submit-additional"
                                title={t(
                                    'FormProposalOwner.AdditionalDocument.textAddDocument',
                                )}
                                onSubmit={handleAddDoc}
                            />
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default ModalInput;
