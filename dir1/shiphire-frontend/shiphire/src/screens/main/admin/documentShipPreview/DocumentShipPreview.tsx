import React from 'react';
import { useTranslation } from 'react-i18next';
import PDFView from 'react-native-view-pdf';
import { useDispatch } from 'react-redux';
import { Button, ScreenLayout } from '../../../../components';
import { Color } from '../../../../configs';
import { modalSlice } from '../../../../slices';
import { DocumentShipPreviewProps } from '../../../../types';

const DocumentShipPreview: React.FC<DocumentShipPreviewProps> = ({
    route,
}) => {
    const dispatch = useDispatch();
    const { hideModal, showModal } = modalSlice.actions;
    const { documentUrl } = route.params;
    const { t } = useTranslation('common');

    const handleError = () => {
        dispatch(
            showModal({
                status: 'failed',
                text: t('DocumentShipPreview.failedLoad'),
            }),
        );
        setTimeout(() => {
            dispatch(hideModal());
        }, 3000);
    };
    console.log(documentUrl)
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
        </>
    );
};

export default DocumentShipPreview;
