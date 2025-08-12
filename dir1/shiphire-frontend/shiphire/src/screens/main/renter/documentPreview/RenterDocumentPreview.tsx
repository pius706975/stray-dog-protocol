import React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native-ui-lib';
import PDFView from 'react-native-view-pdf';
import { useDispatch } from 'react-redux';
import { Button, ScreenLayout } from '../../../../components';
import { Color } from '../../../../configs';
import { modalSlice } from '../../../../slices';
import { RenterDocumentPreviewProps } from '../../../../types';

const RenterDocumentPreview: React.FC<RenterDocumentPreviewProps> = ({
    route,
}) => {
    const dispatch = useDispatch();
    const { t } = useTranslation('common');
    const { hideModal, showModal } = modalSlice.actions;
    const { documentUrl, isEditable } = route.params;

    const handleError = () => {
        dispatch(
            showModal({
                status: 'failed',
                text: t('RenterDocPreview.failedLoad'),
            }),
        );
        setTimeout(() => {
            dispatch(hideModal());
        }, 3000);
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
            {isEditable && (
                <View
                    style={{
                        position: 'absolute',
                        bottom: 30,
                        right: 30,
                    }}>
                    <Button
                        title="Edit Document"
                        color="success"
                        onSubmit={() => {}}
                    />
                </View>
            )}
        </>
    );
};

export default RenterDocumentPreview;
