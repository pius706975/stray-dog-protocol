import React from 'react';
import { View } from 'react-native-ui-lib';
import PDFView from 'react-native-view-pdf';
import { useDispatch } from 'react-redux';
import { Button, ScreenLayout } from '../../../../components';
import { Color } from '../../../../configs';
import { modalSlice, progressIndicatorSlice } from '../../../../slices';
import { AcceptRFQRequest, OwnerDocumentPreviewProps } from '../../../../types';
import { useTranslation } from 'react-i18next';
import { useUpdateTransactionAcceptRFQ } from '../../../../hooks';

const OwnerDocumentPreview: React.FC<OwnerDocumentPreviewProps> = ({
    navigation,
    route,
}) => {
    const { documentUrl, shipId, documentName } = route.params;
    const dispatch = useDispatch();
    const { showProgressIndicator, hideProgressIndicator } =
        progressIndicatorSlice.actions;
    const { hideModal, showModal } = modalSlice.actions;
    const mutationUpdateTransactionAcceptRFQ = useUpdateTransactionAcceptRFQ();
    const { t } = useTranslation('common');

    const handleError = () => {
        dispatch(
            showModal({
                status: 'failed',
                text: t('DocumentPreview.failedLoad'),
            }),
        );
        setTimeout(() => {
            dispatch(hideModal());
        }, 3000);
    };

    const handleEditDocument = () => {
        navigation.navigate('EditDocumentForm', {
            documentUrl: documentUrl,
            shipId: shipId!!,
            documentName,
        });
    };

    return (
        <>
            <ScreenLayout testId="DocumentShipScreen" backgroundColor="light">
                {documentUrl && (
                    <PDFView
                        fadeInDuration={250.0}
                        style={{
                            flex: 1,
                            borderWidth: 1,
                            backgroundColor: Color.bgColor,
                        }}
                        resource={documentUrl}
                        resourceType={'url'}
                        onError={error => handleError()}
                    />
                )}
            </ScreenLayout>

            {/* <View
                style={{
                    position: 'absolute',
                    bottom: 30,
                    right: 30,
                }}>
                <Button
                    title="Edit Document"
                    color="success"
                    onSubmit={() => {
                        handleEditDocument();
                    }}
                />
            </View> */}
        </>
    );
};

export default OwnerDocumentPreview;
