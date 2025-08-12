import React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native-ui-lib';
import PDFView from 'react-native-view-pdf';
import { useDispatch } from 'react-redux';
import { Button, ScreenLayout } from '../../../../components';
import { Color } from '../../../../configs';
import { modalSlice } from '../../../../slices';
import { AdminDocumentPreviewProps } from '../../../../types';

const AdminDocumentPreview: React.FC<AdminDocumentPreviewProps> = ({
    route,
}) => {
    const dispatch = useDispatch();
    const { hideModal, showModal } = modalSlice.actions;
    const { documentUrl, isButtonActive, btnText } = route.params;
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
            {isButtonActive && (
                <View
                    style={{
                        position: 'absolute',
                        bottom: 30,
                        right: 30,
                    }}>
                    <Button
                        title={btnText ? btnText : ''}
                        color="success"
                        onSubmit={() => {
                            // onClick!!();
                        }}
                    />
                </View>
            )}
        </>
    );
};

export default AdminDocumentPreview;
